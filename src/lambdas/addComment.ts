// Load the AWS SDK for Node.js

import { CreateResponse } from "../models/response";

import moment from 'moment';
const commentTable = process.env.commentTable
const data = require('data-api-client')({
    secretArn: 'arn:aws:secretsmanager:us-east-1:695738586291:secret:rds-db-credentials/cluster-UCV7NHJ4XZBVN2AHILGQV3UA74/admin-y7G6oi',
    resourceArn: 'arn:aws:rds:us-east-1:695738586291:cluster:blokparty-cluster',
    database: 'blokparty_db',
})
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
};
module.exports.handler = async (event, context): Promise<CreateResponse> => {

    try {

        console.log(event);

        let body = JSON.parse(event.body);

        if (body == null) {
          return new CreateResponse(400, "Body is null", headers)
        }

        else {
            let sql = createQuery(body);
            let results = await data.query(sql);

            // update rate table
            if(results) {
                let insertSql = "insert into blokparty_db.Rate (BusinessId, Rate) values (" + body.id + ", " + body.rate + ")";
                await data.query(insertSql);
            }
            console.log(results);
            return new CreateResponse(200, JSON.stringify(results), headers)
        }

    }
    catch (error) {
        console.log(error);
        return new CreateResponse(500, error.toString(), headers, error)
    }
};

export function createQuery(body: any): string {

    let dateSubmitted = moment();

    let sql = " insert into " + commentTable + " (BusinessId, Comment, User, Rate, DateSubmitted) values " +
    "(" + body.id + ", " + "'" + body.review + "'" + ", " + "'" + body.user + "'" + ", "
     + body.rate + ", " + "'" + dateSubmitted.format("X") + "'" + ")";

     console.log("SQL: " + sql);
     return sql;
}