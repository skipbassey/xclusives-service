'use strict'

const admin = require("firebase-admin");
// import * as admin from 'firebase-admin';

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blokparty-1c549.firebaseio.com"
});

// Helper funtion for generating the response API Gateway requires to handle the token verification
const generateIamPolicy = (effect, resource, data) => {
    const authResponse: any = {};
  
    // Define a user object that passes user data and other user informationd decoded from the Firebase token to the Lambda API handler
    const user: any = {};
  
    // Populate the API Gateway user principalId with the Firebase user id, or 'unavailable' if not returned from Firebase
    data ? authResponse.principalId = data.user_id : 'blokparty-google-user';
  
    // Map values into context object passed into Lambda function, if data is present
    if (data) {
      user.email = data.email;
      user.email_verified = data.email_verified;
      authResponse.context = user;
    }
  
    if (effect && resource) {
      const policyDocument: any = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      const statementOne: any = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
  
    return authResponse;
  }
  
  module.exports.handler = async (event, context) => {
  
    try {
  
      // Return from function if no authorizationToken present in header
      // context.fail('Unauthorized') will trigger API Gateway to return 401 response
      if (!event.authorizationToken) {
        return context.fail('Unauthorized');
      }
  
      // If auhorizationToken is present, split on space looking for format 'Bearer <token value>'
      const tokenParts = event.authorizationToken.split(' ');
      const tokenValue = tokenParts[1];
  
      // Return from function if authorization header is not formatted properly
      if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        return context.fail('Unauthorized');
      }
  
      // Prepare for validating Firebase JWT token by initializing SDK
    //   initializeSdk();
  
      // Call the firebase-admin provided token verification function with
      // the token provided by the client
      // Generate Allow on successful validation, otherwise catch the error and Deny the request
      let resp = await admin.auth().verifyIdToken(tokenValue);
      return generateIamPolicy('Allow', event.methodArn, resp);
  
    } catch (err) {
      console.log(err);
      return generateIamPolicy('Deny', event.methodArn, null);
    }
  }