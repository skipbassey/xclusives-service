export class Response {

    statusCode: number;
    body: string | undefined;
    headers: Object;
    error?: string | undefined;
    constructor(
        statusCode: number, 
        body: string | undefined,
        headers: Object, 
        error: string | undefined = undefined
        ) { 
            this.statusCode = statusCode;
            this.body = body;
            this.headers = headers;
            this.error = error
        }
}

export class GetResponse extends Response {}
export class PutRespone extends Response {}
export class CreateResponse extends Response {}