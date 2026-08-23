const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const crypto = require('crypto');

const s3Client = new S3Client({});
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient({});

exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event, null, 2));

    try {
        const { employee_id, course_id, employee_name, course_name, employee_email } = event;

        if (!employee_id || !course_id || !employee_email) {
            console.error("Missing required fields in event.");
            return; // Exit if invoked without proper data
        }

        // 1. Generate unique Certificate ID
        const certificateId = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const issueDate = new Date().toISOString();

        // 2. Generate PDF Certificate
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Draw border
        page.drawRectangle({
            x: 20, y: 20, width: 560, height: 360,
            borderColor: rgb(0.2, 0.4, 0.8),
            borderWidth: 5,
        });

        // Add text
        page.drawText('Certificate of Completion', { x: 120, y: 310, size: 30, font: helveticaBold, color: rgb(0, 0, 0) });
        page.drawText('This is to certify that', { x: 220, y: 260, size: 16, font: timesRomanFont });
        page.drawText(employee_name || 'Employee', { x: 200, y: 220, size: 24, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        page.drawText('has successfully completed the course:', { x: 180, y: 180, size: 16, font: timesRomanFont });
        page.drawText(course_name || 'AWS Serverless Basics', { x: 150, y: 140, size: 20, font: helveticaBold, color: rgb(0.2, 0.4, 0.8) });
        
        page.drawText(`Certificate ID: ${certificateId}`, { x: 50, y: 50, size: 12, font: timesRomanFont });
        page.drawText(`Date: ${issueDate.split('T')[0]}`, { x: 450, y: 50, size: 12, font: timesRomanFont });

        const pdfBytes = await pdfDoc.save();

        // 3. Upload to S3
        const bucketName = process.env.CERTIFICATE_BUCKET;
        const s3Key = `certificates/${employee_id}/${course_id}.pdf`;

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: pdfBytes,
            ContentType: 'application/pdf'
        }));

        // 4. Save metadata to DynamoDB
        await docClient.send(new PutCommand({
            TableName: process.env.CERTIFICATES_TABLE,
            Item: {
                certificate_id: certificateId,
                employee_id: employee_id,
                course_id: course_id,
                issued_date: issueDate,
                s3_key: s3Key,
                status: 'valid'
            }
        }));

        // 5. Generate Pre-signed URL
        const presignedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: bucketName,
            Key: s3Key
        }), { expiresIn: 604800 }); // Valid for 7 days

        // 6. Send SES Email
        const senderEmail = process.env.SENDER_EMAIL;
        
        const emailParams = {
            Source: senderEmail,
            Destination: { ToAddresses: [employee_email] },
            Message: {
                Subject: { Data: `Your Certificate for ${course_name}` },
                Body: {
                    Text: {
                        Data: `Congratulations ${employee_name}!\n\nYou have successfully completed ${course_name}. You can download your certificate using the link below (valid for 7 days):\n\n${presignedUrl}\n\nCertificate ID: ${certificateId}\nTo verify this certificate, visit our verification portal.`
                    }
                }
            }
        };

        await sesClient.send(new SendEmailCommand(emailParams));
        console.log(`Certificate ${certificateId} generated and emailed to ${employee_email}`);

    } catch (error) {
        console.error("Error generating certificate:", error);
        throw error;
    }
};
