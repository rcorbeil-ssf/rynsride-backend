var async = require("async");
module.exports = function(PostedTrips) {
	PostedTrips.remoteMethod('getNames', {
        http: {getNames: '/getNames', verb: 'post'},
        accepts: [
            {arg: 'geolocation', type: 'object', description: 'Location near trips.'}
        ],
        notes: 'Hello World',
        description: "I'm a description.",
        returns: {type: 'object', root: true}
    });
    // PostedTrips.getNames();
    
    PostedTrips.getNames = function(geolocation, cb) {
    	PostedTrips.find({
			where: {
				startGeopoint:{
					near: geolocation
				}
			}
		}, function(tripErr, tripRes) {
			if(tripErr) {
				var error = new Error('SSFUsers operation failed response error');
				error.statusCode = 500;
				cb(error);
			} else {
				getDrivers(tripRes);
			}
		});
		
		function getDrivers(returnArray) {
			var SSFUsers = PostedTrips.app.models.SSFUsers;
            async.forEachOf(returnArray, function (k, indexNum, next){
				SSFUsers.findOne({
					where: {
						id: k.driverId
					}
				}, 
				function(err, usersResponse){
					if(err || usersResponse === undefined || usersResponse == null) {
						var error = new Error('SSFUsers operation failed response error');
						error.statusCode = 500;
						cb(error);
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