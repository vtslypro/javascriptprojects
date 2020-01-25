// Import HFDM SDK
var HFDM_SDK = require('@adsk/forge-hfdm');
const fs = require('fs');
var datetime = require('node-datetime');
var dateFormat = require('dateformat');
var date = require('date-and-time');
var workspace;


var API_KEY = '7bb554a65435e9f494f53346f3a54985';

var gb = require('geckoboard')(
  API_KEY
);


// get urn that was passed as an argument
// var URN = process.argv[2];
var URN = "urn:adsk.lynx:branch:f7f5e930-ca7d-44a8-a38c-fb408df69661";
// Instantiate HFDM object
var hfdm = new HFDM_SDK.HFDM();
var datasetG = [];
// Connect to the backend server
hfdm.connect({
  serverUrl: 'https://dna.hfdm.autodesk.com'
  // this is where we would put the getBearerToken function
  // getBearerToken: getBearerToken - not needed for the server we use here.
}).then(function() {
  // Create an empty workspace.
  workspace = hfdm.createWorkspace();
  // Initialize the workspace
  return workspace.initialize({
    urn: URN
  });
}).then(function() {
  console.log(
    'Successfully loaded latest state of the provided URN',
    URN
  );

  var lastModifiedDate;
  workspace.on('modified', function(changeSet) {
    // get the properties created from the workspace
    var points = workspace.getEntriesReadOnly();

    for (var i in points) {
      var point = points[i];
      var power = point.get('power').value ? 1 : 0;
      var temp = point.get('temperature').value;
      var time = (new Date(point.get('time').value)).toISOString();
      // var time = point.get('time').value;
      datasetG.push({
        'powerdata': power,
        'temperaturedata': temp,
        'date': time
      });
    }

    gbAnalytics.datasets.findOrCreate({
        id: 'blinky.bytheminute.plusplus',
        fields: {
          powerdata: {
            type: 'number',
            name: 'Power'
          },
          temperaturedata: {
            type: 'number',
            name: 'Temperature'
          },
          date: {
            type: 'datetime',
            name: 'Date'
          }
        }
      },
      function(err, dataset) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(datasetG);
        dataset.put(
          datasetG,
          function(err) {
            if (err) {
              console.error(err);
              return;
            }

            console.log('Dataset created and data added', datasetG[blinkyTemp]);
          }
        );

      }
    );



    /* Finally, the program exits after 5 seconds of inactivity. */

    setInterval(function() {
      if (lastModifiedDate) {
        var now = new Date();
        var delta = now.getTime() - lastModifiedDate.getTime();
        if (delta > 5000) {
          process.exit(1);
        }
      }
    }, 1000);

  });


}).catch(function(error) {
  console.error('Error occurred somewhere in the chain', error);
  process.exit(1);
});