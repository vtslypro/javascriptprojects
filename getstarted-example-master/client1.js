// Import HFDM SDK and your property factory index
var HFDM_SDK = require('@adsk/forge-hfdm');
var PropertyFactory = require ('./templates');

// CLIENT 1

	// Instantiate HFDM object
	var hfdm = new HFDM_SDK.HFDM();
	// Create an empty workspace.
	var workspace = hfdm.createWorkspace();

	// Connect to the backend server
	hfdm.connect({
		serverUrl: 'https://dna.hfdm.autodesk.com'
		// this is where you would put the getBearerToken function.
		// getBearerToken: getBearerToken - not needed on the server we use here
	}).then(function(){
		// Initialize the empty workspace
		return workspace.initialize();
	}).then(function() {
		console.log('Now start client 2 with the following urn as an argument');
		console.log('Commit URN = ', workspace.getActiveUrn());

		/* Once connected, Client 1 will periodically create an instance of “my.example:point2d-1.0.0” 
		property, randomize its x and y coordinates, add it to the Workspace and commit. After 100 
		iterations, the program will exit. */
		var randomize = function() {
			var upperBound = 20;

			return Math.random() * upperBound;
		}

		var counter = 0;
		var addPoint = function() {
			// create property using its typeId
			var point = HFDM_SDK.PropertyFactory.create('my.example:point2d-1.0.0');

			// randomize coordinates between 0 and 20
			point.get('x').setValue(randomize());
			point.get('y').setValue(randomize());

			// add property to the workspace
			workspace.insert(counter, point);
		
			// commit
			return workspace.commit();
		}

		// add a point every second, until you have 100 points
		setInterval(function() {
			addPoint().then(function(){
				counter++;
				if (counter === 100) {
					process.exit(0);
				}
			}).catch(function(error) {
				console.error('Something went wrong', error);
				process.exit(1);
			});
		}, 1000);


	}).catch(function(error){
		console.error('Error occurred somewhere in the chain', error);
		process.exit(1);
	});
