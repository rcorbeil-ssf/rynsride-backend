module.exports = function(model) {
	// instantiates the method
	model.remoteMethod('noToken', {
		http: {path: '/noToken', verb: 'get'},
		accepts: [
			{arg: 'nearby', type: 'geopoint', description: 'Pass in a geopoint, will give nearby trips.'}
		],
		// notes
		// description
		returns: {type: 'object', root: true}
	});
	// what it does
	
	model.noToken = function(geopoint, cb) {
		var PostedTrips = model.app.models.PostedTrips;
		// var
		var async = require("async");
		model.find({
			where: {
				startGeopoint: geopoint
				//more parameters don't need
			}
		}, function(error, success){
			getPostedTrips(success);
		});
		function getPostedTrips(returnArray) {
			async.forEachOf(returnArray, function (k, indexNum, next){
				PostedTrips.find({
					where: {
						//change properties to names to models
					//	startGeopoint: k.__data.startGeopoint,
					//	startDate: k.__data.startDate,
					//	startLocation: k.__data.startAddress.city,
					//	endLocation: k.__data.endAddress.city,	
						startGeopoint: {near: k.__data.startGeopoint}
					},
					
				}, function(err, tripRes){
					if(err) {
						var error = new Error('async.forEach operation failed trips response error');
						error.statusCode = 500;
						next(error);
					}
					else {
						returnArray[indexNum].startGeopoint = tripRes[0].__data.startGeopoint;
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

