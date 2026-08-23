const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event, null, 2));

    try {
        const courseId = event.pathParameters.course_id;

        if (event.httpMethod === 'GET') {
            const response = await docClient.send(new QueryCommand({
                TableName: process.env.QUIZZES_TABLE,
                KeyConditionExpression: 'course_id = :courseId',
                ExpressionAttributeValues: { ':courseId': courseId },
                ProjectionExpression: 'question_id, question_text, options'
            }));

            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ course_id: courseId, questions: response.Items || [] })
            };
        }

        const body = JSON.parse(event.body);

        if (!body.questions || !Array.isArray(body.questions)) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Missing or invalid 'questions' array in request body." })
            };
        }

        const promises = body.questions.map(async (q) => {
            if (!q.question_id || !q.question_text || !q.options || !q.correct_answer) {
                throw new Error("Invalid question format. Must include question_id, question_text, options, and correct_answer.");
            }

            // Hash the correct answer using SHA-256
            const hashedAnswer = crypto.createHash('sha256').update(q.correct_answer).digest('hex');

            const item = {
                course_id: courseId,
                question_id: q.question_id,
                question_text: q.question_text,
                options: q.options,
                correct_answer_hash: hashedAnswer
            };

            await docClient.send(new PutCommand({
                TableName: process.env.QUIZZES_TABLE,
                Item: item
            }));
        });

        await Promise.all(promises);

        return {
            statusCode: 201,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: `Successfully saved ${body.questions.length} questions for course ${courseId}.` })
        };

    } catch (error) {
        console.error("Error saving quiz questions:", error);
        return {
            statusCode: error.message.includes("Invalid question format") ? 400 : 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: error.message || "Internal server error" })
        };
    }
};
