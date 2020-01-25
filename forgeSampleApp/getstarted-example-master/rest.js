"use strict";
var commonHome = process.cwd() + '/..';

var request = require('requestretry');
var oldRequest = require('request');

//var Promise = require('bluebird');
var debugMode = (process.env.NODE_DEBUG && /\badsk\b/.test(process.env.NODE_DEBUG));

var fs = require('fs')

var certFile = commonHome+ '/common/certs/rover-qa.crt'; //rover.qa-stage.crt.pem';
var keyFile = commonHome+ '/common/certs/rover-qa.key'; //rover.qa-stage.key.pem';

//var count = 0;


function myRetryStrategy(err, response, body){
        // retry the request if we had an error or if the id of the response was blank
        if (debugMode) 
            console.log("\nRest ######### Retrying ", err, body, JSON.stringify(response.body));
        
        return err || !response.body.appcast.id;
      };

function myTestRetryStrategy(err, response, body){
        // retry the request if we had an error or if the id of the response was blank
        if (debugMode) 
            console.log("\nRest ######### Retrying ", err, body, JSON.stringify(response.body));
        
        return err;
      };

module.exports = {


  getNoRetry: function(uri, headers, callback) {
    //console.log('$$$$$$$$$$$$$$ GET no retry called'); 
    //console.log("\n### uri", uri);
    var options = {
      uri: uri,
            rejectUnauthorized: false, 
      json: true // Automatically parses the JSON string in the response
    };

    if (headers) {
      options["headers"] = headers;
    };
    
    //console.log("\n### headers", headers);
    //debugger;
    
    request(options).then(function (result) {
        if (debugMode) 
          console.log('Rest $$$$$$$$$$$$$$ GET succeeded. ' + JSON.stringify(result)); 
        callback(null, result);
    },function (err) { 
        if (debugMode) 
          console.log('Rest $$$$$$$$$$$$$$ GET failed. ' + err);
        callback(err, null);
    }).catch(function(err) {
        if (debugMode) 
            console.log('Rest $$$$$$$$$$$$$$ GET error. ' + err);
    });
    
  },

  get: function(uri, headers, callback) {
        //console.log('$$$$$$$$$$$$$$ GET called'); 
    var options = {
      uri: uri,
      rejectUnauthorized: false, 
      maxAttempts: 11,   // (default) try 5 times 
      retryDelay: 10000,  // (default) wait for 5s before trying again
       retryStrategy: myRetryStrategy, 
      json: true // Automatically parses the JSON string in the response
    };

    if (headers) {
      options["headers"] = headers;
    };
    debugger;
    request(options)
    .then(function (result) {
        if (debugMode) 
          console.log('Rest $$$$$$$$$$$$$$ GET succeeded. ' + JSON.stringify(result));
        callback(null, result);
    },function (err) {
        if (debugMode) 
          console.log('Rest $$$$$$$$$$$$$$ GET failed. ' + err);
        callback(err, null);
    });
    
  },


  post: function(uri, headers, body, callback) {

  
    var options = {
      'method': 'POST',
     'url': uri,
      'body': body,
      'headers': headers,
      'cert': fs.readFileSync(certFile),
      'key': fs.readFileSync(keyFile),
      'rejectUnauthorized': false,
      'fullResponse': true,
      'retryStrategy': request.RetryStrategies.HTTPOrNetworkError,  
      'maxAttempts': 5,   // (default) try 5 times 
      'retryDelay': 1000,  // (default) wait for 1s before trying again
      'json': true // Automatically stringifies the body to JSON
    };

  if (debugMode) {
  //  console.log("\n Uri ", ">"+uri+"<");
  //  console.log("\n Body ", ">"+JSON.stringify(body)+"<");
  //  console.log("\n Options ", JSON.stringify(options));
  }
  
  
 
  request(uri, options)
    .then(function (parsedBody) {
        if (debugMode) 
            console.log('$$$$$$$$$$$$$$ POST succeeded. ' + JSON.stringify(parsedBody));
        callback(parsedBody, parsedBody.body);
        
    },function (err) {
        if (debugMode) 
            console.log('$$$$$$$$$$$$$$ POST failed. ' + err);
        callback(err, null);
    });
  
  }

};