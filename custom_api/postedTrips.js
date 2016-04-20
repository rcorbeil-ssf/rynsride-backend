module.exports = function(PostedTrips) {
	PostedTrips.remoteMethod('getNames', {
        http: {path: '/getNames', verb: 'post'},
        accepts: [
            {arg: 'geolocation', type: 'object', description: 'Location near trips.'},
            {arg: 'userId', type: 'string', description: 'Driver of trip'}
        ],
        // notes: 'Gets local trips based on geolocation',
        // description: "I'm a description.",
        returns: {type: 'object', root: true}
    });
    // PostedTrips.getNames();
    
    PostedTrips.getNames = function(geolocation, userId, cb) {
			var async = require("async");
    	PostedTrips.find({
			where: {
				//filter by nearest rides based on geopoint
				startGeopoint: {near: geolocation},
				//filter out driverId's of the current user neq(not equal)
				driverId: {neq: userId}
			}
		}, function(tripErr, success) {
			if(tripErr) {
				var error = new Error('SSFUsers operation failed response error');
				error.statusCode = 500;
				cb(error);
			} else {
				getDrivers(success);
			}
		});
		function getDrivers(returnArray) {
			var SSFUsers = PostedTrips.app.models.SSFUsers;
            async.forEachOf(returnArray, function (k, indexNum, next){
				SSFUsers.findOne({
					where: {
						id: k.driverId
					}
				},function(err, usersResponse){
					console.log(usersResponse);
					if(err || usersResponse === undefined || usersResponse === null) {
						var error = new Error('No trips available at this time.');
						error.statusCode = 500;
						next(error);
					}
					else {
				        returnArray[indexNum].firstName = usersResponse.__data.firstName;
				        returnArray[indexNum].lastName = usersResponse.__data.lastName;
				        returnArray[indexNum].photo = usersResponse.__data.photo;
				        returnArray[indexNum].age = usersResponse.__data.age;
				        returnArray[indexNum].gender = usersResponse.__data.gender;
				        next();
					}
				});
            },function(err){
                if(err){
            		var error = new Error('async.forEach operation failed');
            		error.statusCode = 500;
            		cb(error);
            	} 
            	cb(0, returnArray);
            });
		}
    };
};