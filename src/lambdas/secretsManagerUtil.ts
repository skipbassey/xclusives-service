import { SecretsManager } from "aws-sdk";

export class SecretsManagerUtil {

    secretName = "s3User";
    secret = "";
    region = "us-east-1"
    decodedBinarySecret = "";

    constructor(
        private sm: SecretsManager
    ) { }

    getS3Secret() {
        let secret = this.sm.getSecretValue({SecretId: this.secretName})
        console.log(secret);
        // this.sm.getSecretValue({ SecretId: this.secretName }, function (err, data) {
        //     if (err) {
        //         if (err.code === 'DecryptionFailureException')
        //             throw err;
        //         else if (err.code === 'InternalServiceErrorException')
        //             throw err;
        //         else if (err.code === 'InvalidParameterException')
        //             throw err;
        //         else if (err.code === 'InvalidRequestException')
        //             throw err;
        //         else if (err.code === 'ResourceNotFoundException')
        //             throw err;
        //     }
        //     else {
        //         if ('SecretString' in data) {
        //             let secret = data.SecretString;
        //         } else {
        //             let buff = new Buffer(data.SecretBinary, 'base64');
        //             let decodedBinarySecret = buff.toString('ascii');
        //         }
        //     }
        // })
    }
}