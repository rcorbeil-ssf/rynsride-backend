module.exports = function(model) {
	// instantiates the method
	model.remoteMethod('computeMatches', {
		http: {path: '/computeMatches', verb: 'put'},
		accepts: [
			{arg: 'nearby', type: 'geopoint', description: 'Pass in a geopoint, will give nearby trips.'}
		],
		// notes
		// description
		returns: {type: 'object', root: true}
	});
	// what it does
	
	model.computeMatches = function(geopoint, cb) {
		var PostedTrips = model.app.models.PostedTrips;
		var stubRideRequest = {
			"startGeopoint": {"lng": -117, "lat": 32},
			"destGeopoint": {"lng": -116, "lat": 31},
			"startDate": "2016-03-30T00:00:00.000Z",
			//"startTime": 9:04AM
		};
		

		var async = require("async");
		model.find({
			where:{
				startGeopoint:
					{maxDistance: 10000, 
					  near:	{lat: stubRideRequest.startGeopoint.lat, lng: stubRideRequest.startGeopoint.lng 
						
					}},
				destGeopoint:
					{maxDistance: 10000, 
					  near:	{lat: stubRideRequest.destGeopoint.lat, lng: stubRideRequest.destGeopoint.lng 
						
					}},
				state: "new",
				startDate: stubRideRequest.startDate
			}
		}, function(error, success){
			getPostedTrips(success);
		});
		function getPostedTrips(returnArray) {
			async.forEachOf(returnArray, function (k, indexNum, next){
				PostedTrips.find({
					where: {
						//change properties to names to models
				
						startGeopoint: {near: k.startGeopoint}
					},
					
				}, function(err, tripRes){
					if(err) {
						var error = new Error('async.forEach operation failed trips response error');
						error.statusCode = 500;
						next(error);
					}
					else {
						returnArray[indexNum].startGeopoint = tripRes[0].startGeopoint;
						// returnArray[indexNum].firstName = riderResponse[0].__data.firstName;  example
						 next();
					}
				});
			}, function(err) {
			    if(err) {
			    	var error = new Error('async.forEach operation failed general error');
            		error.statusCode = 500;
            		cb(error);
			    }
			    // postedTripData(returnArray);
			    cb(0, returnArray);
			});
		}
	};
};

