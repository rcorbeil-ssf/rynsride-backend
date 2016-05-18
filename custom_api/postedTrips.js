module.exports = function(PostedTrips) {
	PostedTrips.remoteMethod('getNames', {
        http: {path: '/getNames', verb: 'post'},
        accepts: [
            {arg: 'geolocation', type: 'object', description: 'Location near trips.'},
            {arg: 'userId', type: 'string', description: 'Driver of trip'},
            {arg: 'timeZoneOffset', type: 'number', description: 'timeZoneOffset of trip start'},
            {arg: 'timeNow', type: 'number', description: 'time now of client'},
        ],
        // notes: 'Gets local trips based on geolocation',
        // description: "I'm a description.",
        returns: {type: 'object', root: true}
    });
    
    PostedTrips.getNames = function(geolocation, userId, timeZoneOffset, nowDateTime, cb) {
		var async = require("async");
		var SSFUsers = PostedTrips.app.models.SSFUsers;
		
		var nowDateTimeAdjusted = nowDateTime + (3600000); //add 1 hr to account for discrepancy between PST,PDT
		
    	PostedTrips.find({
			where: {
				//filter by nearest rides based on geopoint
				startGeopoint: {near: geolocation},
				//filter out driverId's of the current user neq(not equal)
				driverId: {neq: userId},
				or:[	
					{state: "new"},
					{state: "matched"}
				  ],
				startDateTime: {gt: nowDateTimeAdjusted},
				timeZoneOffset: timeZoneOffset
			},
			order: 'startDateTime ASC'
			//limit: 10
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
			
            async.forEachOf(returnArray, function (k, indexNum, next){
				SSFUsers.find({
					where: {
						id: k.driverId
					}
				},function(err, usersResponse){
					if(err || usersResponse === undefined || usersResponse === null) {
						var error = new Error('No trips available at this time.');
						error.statusCode = 500;
						next(error);
					}
					else if(usersResponse.length > 0){
						returnArray[indexNum].firstName = usersResponse[0].__data.firstName;
						returnArray[indexNum].lastName = usersResponse[0].__data.lastName;
						returnArray[indexNum].photo = usersResponse[0].__data.photo;
						returnArray[indexNum].age = usersResponse[0].__data.age;
						returnArray[indexNum].gender = usersResponse[0].__data.gender;
						};
					next();
					
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