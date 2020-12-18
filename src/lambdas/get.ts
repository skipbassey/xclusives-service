
import { GetResponse, Response } from "../models/response";
import moment from 'moment';

const businessTable = process.env.businessTable;
const businessTypesTable = process.env.businessTypesTable;
const rateTable = process.env.rateTable;
const commentTable = process.env.commentTable

const data = require('data-api-client')({
  secretArn: 'arn:aws:secretsmanager:us-east-1:695738586291:secret:rds-db-credentials/cluster-UCV7NHJ4XZBVN2AHILGQV3UA74/admin-y7G6oi',
  resourceArn: 'arn:aws:rds:us-east-1:695738586291:cluster:blokparty-cluster',
  database: 'blokparty_db',

})

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    "Access-Control-Allow-Credentials": true
};

module.exports.handler =  async (event, context): Promise<GetResponse> => {
   
    try {

        console.log(event);

        let types = Object.keys(event.queryStringParameters)
        let type = types[0];
    
        let values = Object.values(event.queryStringParameters);
        let value = values[0];

        if(types == null && values == null) {
            return new GetResponse(400, "No parameters", headers)
        }
        else {
            let sql = createQuery(type, value);
            // console.log("SQL: " + sql)
            let resposne = await data.query(sql);
            console.log(resposne)
            return new GetResponse(200, JSON.stringify(resposne), headers)
        }
    } catch (error) {
        console.log(error);
        return new GetResponse(500, error.message, headers, error.toString())
    } 

};

export function createQuery(type, value): string {
    let sql = "";
    switch (type) {
        case 'new':
            let currentDate = moment();
            let dateOld = moment().subtract(30, "days");

            sql = "select * from " + businessTable + " where DateCreated >= " + "'" + dateOld.format("X") + "'" + " " + "and DateCreated <=" + " " + "'" + currentDate.format('X') + "'" + " " +
            "and Accepted = true and Active = true order by DateCreated desc";
            break;
        case 'type':
             sql = "select * from " + businessTable + " where Type = " + "'" + value + "'" + " order by DateCreated";
            break;
        case 'approved':
            switch(value) {
                case "true":
                    sql = "select * from " + businessTable + " where Active = true and Accepted = true order by DateCreated";
                    break;
                case "null":
                    sql = "select * from " + businessTable + " where Accepted IS NULL and Active IS NULL order by DateCreated";
                    break;
                case "false":
                    sql = "select * from " + businessTable + " where Accepted = false and Active = false order by DateCreated";
                    break;
            }
            break;
        case "business-types":
            sql = "select * from " + businessTypesTable + " order by Type"
            break;
        case "nearby":
            // let zipcodeSet = []
            // let res = zipcodes.radius('28262', 10, true);
            // console.log(res);
            sql = "";
            break;
        case "rate":
            sql = "select ROUND(AVG(Rate)) as rate from " + rateTable + " where BusinessId = " + value;
            break;
        case "most-popular":
            sql = "select * from " + businessTable + " where Active = true and Accepted = true order by avg(Rate) desc limit 10";
            break;
        case "owner":
            sql = "select * from " + businessTable + " where Active = true and OwnerEmail = " + "'" + value + "'";
            break;
        case "comments":
            sql = "select * from " + commentTable + " where BusinessId = " + value + " order by DateSubmitted desc limit 5";
            break;
        case "search":
            sql = "select * from " + businessTable + " where Active = true and Accepted = true and Name like '%" + value + "%'"
            break;
        default:
    }
    console.log("SQL: "+ sql);
    return sql;

}