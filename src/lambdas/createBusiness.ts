// Load the AWS SDK for Node.js

import { CreateResponse } from "../models/response";

import moment from 'moment';
const data = require('data-api-client')({
  secretArn: 'arn:aws:secretsmanager:us-east-1:695738586291:secret:rds-db-credentials/cluster-UCV7NHJ4XZBVN2AHILGQV3UA74/admin-y7G6oi',
  resourceArn: 'arn:aws:rds:us-east-1:695738586291:cluster:blokparty-cluster',
  database: 'blokparty_db',
})

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
};

const table = "blokparty_db.Business"

module.exports.handler = async (event, context): Promise<CreateResponse> => {

    try {

        console.log(event);

        if(event.body == null) {
            return new CreateResponse(400, "Body does not exist", headers)
        }
        else {
            let body = JSON.parse(event.body);
            let sql = createQuery(body);
            let resposne = await data.query(sql);
            console.log(resposne);
            return new CreateResponse(200, JSON.stringify(resposne), headers)
        }
    } catch (error) {
        console.log(error);
        return new CreateResponse(500, error.message, headers, error.toString())
    } 

};

export function createQuery(body): any {
    let dateCreated = moment();
    let dateUpdated = moment();

    let sql = "insert into " + table  + " (Name, Owner, OwnerEmail, Description, ImageCount, Presence," +
    "Verified, Accepted, Active, Type, DateCreated, DateUpdated, Street, City, State, Zipcode, " +
    "Website, Twitter, Instagram, Facebook) " +
    "values ( " + "'" + body.name + "'" + ", " + "'" + body.owner + "'" + ", " + "'" + body.ownerEmail + "'" +
    ", " + "'" + body.description + "'" + ", " + "'" + body.imageCount + "'" + ", " +
    "'" + body.presence + "'" + ", " + null + ", " + null +  ", " +
    null + ", " + "'" + body.type + "'" +  ", " +  "'" + dateCreated.format('X') + "'" +  ", " +
    "'" + dateUpdated.format('X') + "'" + ", " + "'" + body.street + "'" + ", " + "'" + body.city + "'" +  ", " +
    "'" + body.state + "'" + ", " + "'" + body.zipcode + "'" + ", " + "'" + body.website + "'"+  ", " +
    "'" + body.twitter + "'"+ ", " + "'" + body.instagram + "'" + ", " + "'" + body.facebook + "'" + ")"

    console.log("SQL: "+ sql);
    return sql;
}