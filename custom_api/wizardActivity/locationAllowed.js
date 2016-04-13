module.exports = function(model) {
	// instantiates the method
	model.remoteMethod('locationAllowed', {
		http: {path: '/locationAllowed', verb: 'get'},
		accepts: [
			{arg: 'nearby', type: 'geopoint', description: 'Pass in a geopoint, will give nearby trips.'}
		],
		// notes
		// description
		returns: {type: 'object', root: true}
	});
	// what it does
	
	model.locationAllowed = function(geopoint, cb) {
		var PostedTrips = model.app.models.PostedTrips;
		// var
		var async = require("async");
		model.find({
			where:
				{startGeopoint:
					{near:	geopoint}}
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

//	returnArray[indexNum].startGeopoint = tripRes[0].startGeopoint;