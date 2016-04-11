var noTokenApi = require('../../custom_api/wizardActivity.js');
var getNamesApi = require('../../custom_api/postedTrips.js');
module.exports = function(PostedTrips) {
    noTokenApi(PostedTrips);
    getNamesApi(PostedTrips);
    
    // PostedTrips.afterRemote('find', function(context, instance, next) {
    //     var SSFUsers = PostedTrips.app.models.SSFUsers;
    //     var async = require("async");
        
    //     getNames(instance);
    //     function getNames(returnArray) {
    //         async.forEachOf(returnArray, function (k, indexNum, next) {
    //         // 	var responseName = 'response'+indexNum;
    //         	SSFUsers.find({
    //         		where: {
    //         			id: k.__data.driverId
    //         		}
    //         	},function(err, usersResponse) {
    //         		if(err) {
    //         			var error = new Error('async.forEach operation failed');
    //         			error.statusCode = 500;
    //         			next(error);
    //         		}
    //         		else {
    //         			k.__data.firstName = usersResponse[0].__data.firstName;
    //         			k.__data.lastName = usersResponse[0].__data.lastName;
    //         			k.__data.photo = usersResponse[0].__data.photo;
    //         			k.__data.gender = usersResponse[0].__data.gender;
    //         			k.__data.age = usersResponse[0].__data.age;
    //         			next();
    //         		}
    //         	});
    //         },function(err) {
    //         	if(err) {
    //         		var error = new Error('async.forEach operation failed');
    //         		error.statusCode = 500;
    //         		next(error);
    //         	}
    //         	next(0, returnArray);
    //             // endService(returnArray, totalPages);
    //         });
    //     }
    // });


var locationAllowed = require('../../custom_api/wizardActivity/locationAllowed.js');
module.exports = function(PostedTrips) {
    locationAllowed(PostedTrips);
  
};
