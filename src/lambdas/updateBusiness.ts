import moment from 'moment';
import { PutRespone } from '../models/response';

const data = require('data-api-client')({
    secretArn: 'arn:aws:secretsmanager:us-east-1:695738586291:secret:rds-db-credentials/cluster-UCV7NHJ4XZBVN2AHILGQV3UA74/admin-y7G6oi',
    resourceArn: 'arn:aws:rds:us-east-1:695738586291:cluster:blokparty-cluster',
    database: 'blokparty_db',
})

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
};

const table = process.env.businessTable;
module.exports.handler = async (event, context): Promise<PutRespone> => {
    
    try {
        console.log(event);

        if(event.body == null) {
            return new PutRespone(400, "Body does not exist", headers)
        }
        else {
            let body = JSON.parse(event.body);
            let sql = createQuery(body);
            let resposne = await data.query(sql);
            console.log(resposne);
            return new PutRespone(200, JSON.stringify(resposne), headers)
        }
    } catch (error) {
        console.log(error);
        return new PutRespone(500, error.message, headers, error.toString())
    }
}

export function createQuery(body): any {
    try {
        let sql = "";
        let dateUpdated = moment()

        switch (body.action) {
            case 'approve':
                sql = "update " + table + " set Accepted = " + "'" + body.value + "'" +
                    ", Active = " + "'" + body.value + "'" + ", DateUpdated = " + "'"+ dateUpdated.format('X') + "'" + " where Id = " + "'" + body.id + "'";
                break;
            case 'deny':
                sql = "update " + table + " set Accepted = " + "'" + body.value + "'" +
                    ", Active = " + "'" + body.value + "'" + ", DateUpdated = " + "'"+ dateUpdated.format('X') + "'" + " where Id = " + "'" + body.id + "'";
                break;
            case 'delete':
                sql = "update " + table + " set Active = " + "'" + body.value + "'" + " where Id = " + "'" + body.id + "'";
                break;
            case 'update':
                sql = "update " + table + " set Name = " + "'" + body.name + "'" + ", Owner = " + "'" + body.ownerName + "'" +
                    ", OwnerEmail = " + "'" + body.ownerEmail + "'" + ", Description = " + "'" + body.description + "'" +
                    ", PictureName = " + "'" + body.pictureName + "'" + ", Presence = " + "'" + body.presence + "'" +
                    ", Type = " + "'" + body.type + "'" + ", DateUpdated = " + "'" + dateUpdated.format('X') + "'" +
                    ", Street = " + "'" + body.street + "'" + ", City = " + "'" + body.city + "'" + ", State = " + "'" + body.city + "'" +
                    ", Zipcode = " + "'" + body.zipcode + "'" + ", Website = " + "'" + body.website + "'" + ", Twitter = " +  "'" + body.twitter + "'" +
                    ", Facebook = " + "'" + body.facebook + "'" + ", Instagram = " + "'" + body.instagram + "'" + " where Id = " +  "'" + body.id + "'";
                break;
        }
        console.log(sql)
        return sql;
    }
    catch (ex) {
        console.log("Error: " + ex.toString())
        return null;
    }
}

