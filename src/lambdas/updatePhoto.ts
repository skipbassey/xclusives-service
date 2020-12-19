// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
import { CreateResponse } from '../models/response';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
};
module.exports.handler = async (event, context, callback): Promise<CreateResponse> => {

    try {

        let bucket = process.env.bucket

        console.log(event);

        const done = (err, res) => callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": false
            }
        });
        
        if(event.body == null) {
            return new CreateResponse(400, "Body does not exist", headers);
        }
        else {
            let body = JSON.parse(event.body);

            let params = {
                Body: body.base64,
                Bucket: bucket,
                Key: body.folder + "/" + body.id,
            };

            return await new Promise((resolve, reject) => {
                s3.putObject(params, done)
            })

        }

    } catch (error) {
        console.log(error);

        return new CreateResponse(500, error.toString(), headers, error);
    }

};