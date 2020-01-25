// Import HFDM SDK
	var HFDM_SDK = require('@adsk/forge-hfdm');
  var workspace;

  // get urn that was passed as an argument
	var URN = process.argv[2];

	// Instantiate HFDM object
	var hfdm = new HFDM_SDK.HFDM();
	// Connect to the backend server
	hfdm.connect({
		serverUrl: 'http://ecs-master-opt.ecs.ads.autodesk.com:3000'
    // this is where we would put the getBearerToken function
		// getBearerToken: getBearerToken - not needed for the server we use here.
	}).then(function(){
		// Create an empty workspace.
		workspace = hfdm.createWorkspace();
		// Initialize the workspace
		return workspace.initialize({urn: URN});
	}).then(function() {
		console.log(
			'Successfully loaded latest state of the provided URN',
			URN
		);

    /*On every new point added, Client 2 will iterate through all points rounding off the coordinates 
    and indexing them into a 2D array. */

    var lastModifiedDate;
    workspace.on('modified', function(changeSet){
      var yxPlane = [];
      // get the list of points created for the workspace
      var points = workspace.getEntriesReadOnly();
    
      // put each point in a xy plane
      for (var i in points) {
        var point = points[i];
        var x = Math.floor(point.get('x').getValue());
        var y = Math.floor(point.get('y').getValue());

        if (!yxPlane[x]) {
          yxPlane[x] = [];
        }

        yxPlane[x][y] = true;
      }
    
      lastModifiedDate = new Date();


    /* It then iterates over this 2D array and prints out the points at the given coordinates. */
  
    var toPrint, xPlane;
    for (var y = 0; y < yxPlane.length; y++) {
      toPrint = '';
      xPlane = yxPlane[y];
      if(xPlane){
            for (let x = 0; x < xPlane.length; x++) {
                if (xPlane[x]) {
                    // print point
                    toPrint += 'o';
                } else {
                    // increase left pad
                    toPrint += ' ';
                }
              }
          }
      console.log(toPrint);
    }

    /* Finally, the program exits after 5 seconds of inactivity. */

  	setInterval(function() {
      if(lastModifiedDate) {
        var now = new Date();
        var delta = now.getTime() - lastModifiedDate.getTime();
        if(delta > 5000) {
          process.exit(1);
        }
      }
    }, 1000);
    
    });


	}).catch(function(error){
		console.error('Error occurred somewhere in the chain', error);
		process.exit(1);
	});