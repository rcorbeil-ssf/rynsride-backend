var async = require("async");
module.exports = function(PostedTrips) {
	PostedTrips.remoteMethod('getDriverInfo', {
        http: {getDriverInfo: '/getDriverInfo', verb: 'get'},
        accepts: [
            {arg: 'id', type: 'number', description: 'Pass in driver Id returns driver info'}
        ],
        notes: 'Hello World',
        description: "I'm a description.",
        returns: {type: 'object', root: true}
    });
    // PostedTrips.getNames();
    
    PostedTrips.getDriverInfo = function(id, cb) {
    	PostedTrips.find({
			where: {
			        driverId: id
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
					if(err || usersResponse === undefined) {
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