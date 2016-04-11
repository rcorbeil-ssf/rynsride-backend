module.exports = function(model) {
	// instantiates the method
	model.remoteMethod('getNames', {
		http: {path: '/getNames', verb: 'get'},
		accepts: [
			{arg: 'driverId', type: 'string', description: 'Get SSFUsers data.'}
		],
		// notes
		// description
		returns: {type: 'object', root: true}
	});
	// what it does
	
	model.getNames = function(driverId, cb) {
        var SSFUsers = model.app.models.SSFUsers;
        // var
		model.find({
			where: {
				id: driverId
				//more parameters don't need
			}
		}, function(error, success){
			getSSFUsers(success);
		});
		function getSSFUsers(returnArray) {
			SSFUsers.find({
    			where: {
    				id: driverId
    				//more parameters don't need
    			}
    		}, 
			function(err, usersResponse){
				if(err || usersResponse === undefined) {
					var error = new Error('SSFUsers operation failed response error');
					error.statusCode = 500;
					cb(error);
				}
				else {
				    for (var indexNum in returnArray) {
				        returnArray[indexNum].__data.firstName = usersResponse[indexNum].__data.firstName;
				        returnArray[indexNum].__data.lastName = usersResponse[indexNum].__data.lastName;
				        returnArray[indexNum].__data.photo = usersResponse[indexNum].__data.photo;
				        returnArray[indexNum].__data.age = usersResponse[indexNum].__data.age;
				        returnArray[indexNum].__data.gender = usersResponse[indexNum].__data.gender;
				    }
        			cb(0, returnArray);
				}
			});
		}
	};
};