module.exports = function(model) {
	// instantiates the method
	model.remoteMethod('locationBlocked', {
		http: {path: '/locationBlocked', verb: 'get'},
		accepts: [
			{arg: 'closest', type: 'string', description: 'pull up most recent trips'}
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
				{startLocation:
					{near:	{lat: 1, lng: 1}}}
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

