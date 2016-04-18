module.exports = function(PostedTrips) {

// This custom API adds to the PostedTrips model.
// It searches for any matching RequestRides instances.  If any found, it adds an
// instance to the Matches model.
PostedTrips.remoteMethod(
    'postAndSearch',
    {
    	http: {path: '/postAndSearch', verb: "post"},
        accepts: {arg: 'postedTrip', type: 'object'},
        description: "Posts the trip and searches for matching rides",
        returns: {arg: 'computedData', type: 'object'}
    });
    
PostedTrips.postAndSearch = function(postedTrip, cb) {
    if (postedTrip == undefined || postedTrip == null) {
        var err = new Error('0, UserInputs undefined');
        err.statusCode = 400;
        cb(err);
    }
    else {

	var RideRequests = PostedTrips.app.models.RideRequests;
	var Matches = PostedTrips.app.models.Matches;

	var async = require("async");
	
	// Search for matching Ride requests
	if( postedTrip.startGeopoint == undefined ||
		postedTrip.destGeopoint == undefined ||
		postedTrip.pickupRadius == undefined ||
		postedTrip.startDate == undefined ||
		postedTrip.startTime == undefined) {
			var error = new Error('Invalid input arguments to PostedTrip');
        	error.statusCode = 500;
        	console.log(error);
        	cb(error);
	} else {
		// Remove the HH:MM:SS from the startDate of trip before posting.
		var mSecs = Date.parse(postedTrip.startDate);
		var date = new Date();
		date.setTime(mSecs);
		
		var year = date.getUTCFullYear();
		var month = date.getUTCMonth();
		var day = date.getUTCDate();
		var startDate = new Date();
		// convert to UTC format, lose hrs, min, secs
		startDate.setTime(Date.UTC(year, month, day));
		console.log(startDate);
		postedTrip.startDate = startDate;
		
		THIRTY_MINUTES = 30 * 60 * 1000;  // milliseconds
		
		console.log(postedTrip.startTime);
		console.log(postedTrip.startTime + THIRTY_MINUTES);
		console.log(postedTrip.startTime - THIRTY_MINUTES);
		
		RideRequests.find({
			where:{
				startGeopoint:
					{maxDistance: postedTrip.pickupRadius,
					near:	{lat: postedTrip.startGeopoint.lat, lng: postedTrip.startGeopoint.lng 
					}},
				destGeopoint:
					{maxDistance: postedTrip.pickupRadius,
					  near:	{lat: postedTrip.destGeopoint.lat, lng: postedTrip.destGeopoint.lng 
					}},
				or:[	
					{state: "new"},
					{state: "matched"}
				   ],
				startDate: startDate,
				and:[
				 	{pickupTime: {gte:  postedTrip.startTime - THIRTY_MINUTES}},
				 	{pickupTime: {lte:  postedTrip.startTime + THIRTY_MINUTES}}
				    ]					
			}
		}, function(error, success){
			createMatches(success);
		});
		
		// Create instance(s) in the Matches model
		function createMatches(foundArray) {
			if(foundArray.length > 0){
				postedTrip.state = "matched";
			}
			
			PostedTrips.create(postedTrip, function(err, pTrip){
				if(err) {
					var error = new Error('Unable to create postedTrip');
					error.statusCode = 500;
					//cb(error);								
				} else{
			
					async.forEachOf(foundArray, function (k, indexNum, next){
		
						console.log('Match found: rideId ' + k.id);
						console.log('Match found: tripId ' + pTrip.id);
						
						var properties = {
							tripId: pTrip.id,
							rideId: k.id,
							dateStamp: startDate,
							updateStamp: new Date(),
							state: "matched"
						};
						
						Matches.create(properties, function(err, match){
							if(err) {
								var error = new Error('async.forEach operation failed trips response error');
								error.statusCode = 500;
								next(error);
							}
							else {
								// Update state of RideRequest to 'matched'
								var stateProperty = {
									state: "matched"
								};								
								RideRequests.update({id: k.id},stateProperty, function(err, pRide){
									if(err) {
										var error = new Error('Unable to update requestRide to "matched"');
										error.statusCode = 500;
										next(error);								
									} else {
										next();
									}
								});
							}
						});
					}, function(err) {
					    if(err) {
					    	var error = new Error('async.forEach operation failed general error');
			        		error.statusCode = 500;
			        		console.log(error);
					    }
					});
				}
			});	
		}	
	}			
}};
};