module.exports = function(RideRequests) {

// This custom API adds to the RideRequests model.
// It searches for any matching PostedTrip instances.  If any found, it adds an
// instance to the Matches model.
RideRequests.remoteMethod(
    'requestRideAndSearch',
    {
    	http: {path: '/requestRideAndSearch', verb: "post"},
        accepts: {arg: 'requestedRide', type: 'object'},
        description: "Requests the ride and searches for matching rides",
        //returns: {arg: 'computedData', type: 'object'}
    });
    
RideRequests.requestRideAndSearch = function(requestedRide, cb) {
    if (requestedRide == undefined || requestedRide == null) {
        var err = new Error('0, UserInputs undefined');
        err.statusCode = 400;
        cb(err);
    }
    else {

	var PostedTrips = RideRequests.app.models.PostedTrips;
	var Matches = RideRequests.app.models.Matches;

	var async = require("async");
	
	// Search for matching Ride requests
	if( requestedRide.startGeopoint == undefined ||
		requestedRide.destGeopoint == undefined ||
		requestedRide.startDate == undefined ||
		requestedRide.startTime == undefined) {
			var error = new Error('Invalid input arguments to requestedRide');
        	error.statusCode = 500;
        	console.log(error);
        	cb(error);
	} else {
		// convert string to Date object
		//var startDate = new Date(requestedRide.startDate);
		
		// convert UTC string to local Date object
		var startDateLocal = new Date(requestedRide.startDate);
		startDateLocal.setHours(0);
		var startDateTime = startDateLocal.getTime() + requestedRide.startTime;		
		
		var THIRTY_MINUTES = 30 * 60 * 1000;  // milliseconds
		var PICKUP_RADIUS = 5; // miles
		
		PostedTrips.find({
			where:{
				startGeopoint:
					{maxDistance: PICKUP_RADIUS,
					near:	{lat: requestedRide.startGeopoint.lat, lng: requestedRide.startGeopoint.lng 
					}},
				destGeopoint:
					{maxDistance: PICKUP_RADIUS,
					  near:	{lat: requestedRide.destGeopoint.lat, lng: requestedRide.destGeopoint.lng 
					}},
				or:[	
					{state: "new"},
					{state: "matched"}
				   ],
				//startDate: startDate,
				driverId: {neq: requestedRide.riderId},
				// and:[
				//  	{startTime: {gte:  requestedRide.startTime - THIRTY_MINUTES}},
				//  	{startTime: {lte:  requestedRide.startTime + THIRTY_MINUTES}}
				//     ]
				and:[
				 	{startDateTime: {gte:  startDateTime - THIRTY_MINUTES}},
				 	{startDateTime: {lte:  startDateTime + THIRTY_MINUTES}}
				    ]
			}
		}, function(error, success){
			createMatches(success);
		});
		
		// Create instance(s) in the Matches model
		function createMatches(foundArray) {
			if(foundArray.length > 0){
				if(requestedRide.state != "pending"){
					requestedRide.state = "matched";
				}
			}
			
			requestedRide.startDateTime = startDateTime;
			
			RideRequests.create(requestedRide, function(err, pRide){
				if(err) {
					var error = new Error('Unable to create requestedRide');
					error.statusCode = 500;
					//cb(error);								
				} else{
				async.forEachOf(foundArray, function (k, indexNum, next){
	
					console.log('Match found: tripId ' + k.id);
					console.log('Match found: rideId ' + pRide.id);
					
					var properties = {
						rideId: pRide.id,
						tripId: k.id,
						dateStamp: startDateTime,
						updateStamp: new Date(),
						state: requestedRide.state
					};
					
					Matches.create(properties, function(err, match){
						if(err) {
							var error = new Error('async.forEach operation failed trips response error');
							error.statusCode = 500;
							next(error);
						}
						else {
							next();
						}
					});
				}, function(err) {
				    if(err) {
				    	var error = new Error('async.forEach operation failed general error');
		        		error.statusCode = 500;
		        		console.log(error);
				    }
				});
			}});
		}	
	}			
}
cb();
};
};