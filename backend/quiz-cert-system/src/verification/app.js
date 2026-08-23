const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        const certId = event.pathParameters.cert_id;
        
        if (!certId) {
            return { statusCode: 400, body: JSON.stringify({ message: "Missing certificate ID" }) };
        }

        const getParams = {
            TableName: process.env.CERTIFICATES_TABLE,
            Key: { certificate_id: certId }
        };
        
        const response = await docClient.send(new GetCommand(getParams));
        const certificate = response.Item;

        // CORS headers for public API
        const headers = { "Access-Control-Allow-Origin": "*" };

        if (!certificate) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ valid: false, message: "Certificate not found." })
            };
        }

        if (certificate.status !== 'valid') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ valid: false, message: "Certificate has been revoked or is invalid." })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid: true,
                certificate_id: certificate.certificate_id,
                employee_id: certificate.employee_id,
                course_id: certificate.course_id,
                issued_date: certificate.issued_date
            })
        };

    } catch (error) {
        console.error("Verification error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};
