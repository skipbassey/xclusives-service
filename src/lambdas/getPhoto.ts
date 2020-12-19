// Load the AWS SDK for Node.js
import { GetResponse } from '../models/response';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
};
module.exports.handler = async (event, context, callback): Promise<GetResponse> => {

    try {

        console.log(event);

        const done = (err, res) => callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": false,
            }
            
        });

        let bucket = process.env.bucket;

        let secretId = process.env.secretId;
        var credentials = await <any>getSecret(secretId);

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: credentials.key,
            secretAccessKey: credentials.secret
        })

        var id = event["queryStringParameters"]['id'];
        var type = event['queryStringParameters']['type'];

        switch (type) {
            case "business":
                bucket += "/business";
                break;
            case "category":
                bucket += "/category";
                break;
            default:
                bucket += "/business";
        }

        var params = {
            Key: id,
            Bucket: bucket
        };

        let response = await new Promise((resolve, reject) => {
            s3.getObject(params, done)
        })

        console.log(response);

        return new GetResponse(200, "success", headers)

        // return await new Promise((resolve, reject) => {
        //     s3.getObject(params, done)
        // })

    } catch (error) {
        console.log(error)
        return new GetResponse(500, error.toString(), headers, error)
    }

};

export async function getSecret(secretName) {
  

    // Create a Secrets Manager client
    var client = new AWS.SecretsManager({
        region: 'us-east-1'
    });

    return new Promise((resolve,reject)=>{
        client.getSecretValue({SecretId: secretName}, function(err, data) {

            if (err) {
                reject(err);
            }
            else {
                if ('SecretString' in data) {
                    resolve(data.SecretString);
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    resolve(buff.toString('ascii'));
                }
            }
        });
    });
}
