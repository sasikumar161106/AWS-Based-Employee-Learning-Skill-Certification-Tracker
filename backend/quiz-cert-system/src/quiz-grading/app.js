const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const crypto = require('crypto');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const lambdaClient = new LambdaClient({});

exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event, null, 2));
    
    try {
        const courseId = event.pathParameters.course_id;
        const body = JSON.parse(event.body);
        
        // Extract employeeId from Cognito authorizer claims, fallback to body for testing
        const employeeId = event.requestContext?.authorizer?.claims?.sub || body.employee_id; 
        
        if (!employeeId || !body.answers) {
            return { statusCode: 400, body: JSON.stringify({ message: "Missing employee_id or answers" }) };
        }

        // 1. Check Attempt Count
        const getCompletion = new GetCommand({
            TableName: process.env.COMPLETIONS_TABLE,
            Key: { employee_id: employeeId, course_id: courseId }
        });
        const completionRes = await docClient.send(getCompletion);
        let attemptCount = completionRes.Item?.attempt_count || 0;
        
        if (attemptCount >= 3) {
            return { statusCode: 403, body: JSON.stringify({ message: "Maximum of 3 attempts reached." }) };
        }
        attemptCount++;

        // 2. Fetch Quizzes for the Course
        const queryQuizzes = new QueryCommand({
            TableName: process.env.QUIZZES_TABLE,
            KeyConditionExpression: "course_id = :cid",
            ExpressionAttributeValues: { ":cid": courseId }
        });
        const quizzesRes = await docClient.send(queryQuizzes);
        const questions = quizzesRes.Items || [];
        
        if (questions.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ message: "No questions found for this course." }) };
        }

        // 3. Grade Answers
        let correctAnswers = 0;
        const totalQuestions = questions.length;
        
        questions.forEach(q => {
            const submittedAnswer = body.answers[q.question_id];
            if (submittedAnswer) {
                // Hash submitted answer to compare with stored hash
                const hashedAnswer = crypto.createHash('sha256').update(submittedAnswer).digest('hex');
                if (hashedAnswer === q.correct_answer_hash) {
                    correctAnswers++;
                }
            }
        });

        const score = (correctAnswers / totalQuestions) * 100;
        // NOTE: In a full app, passing_score would be fetched from the Courses Table. Assuming 80% here.
        const passed = score >= 80;
        
        // 4. Update Completions Table
        const result = passed ? 'pass' : 'fail';
        await docClient.send(new PutCommand({
            TableName: process.env.COMPLETIONS_TABLE,
            Item: {
                employee_id: employeeId,
                course_id: courseId,
                attempt_count: attemptCount,
                score: score,
                result: result,
                completed_at: new Date().toISOString()
            }
        }));

        // 5. Invoke Certificate Generator Lambda if passed
        if (passed) {
            const invokeParams = {
                FunctionName: process.env.CERTIFICATE_GENERATION_FUNCTION_NAME,
                InvocationType: 'Event', // Asynchronous execution
                Payload: JSON.stringify({
                    employee_id: employeeId,
                    course_id: courseId,
                    employee_name: body.employee_name || "Employee", // Can also be fetched from Cognito/DB
                    course_name: body.course_name || "Course",
                    employee_email: body.employee_email // Required to send the email
                })
            };
            try {
                await lambdaClient.send(new InvokeCommand(invokeParams));
                console.log("Triggered certificate generation");
            } catch (err) {
                console.error("Failed to invoke certificate generator:", err);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: passed ? "Congratulations, you passed!" : "You failed. Please try again.",
                score: score,
                attempt_count: attemptCount,
                result: result
            })
        };

    } catch (error) {
        console.error("Error grading quiz:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};
