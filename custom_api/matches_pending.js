module.exports = function(model) {
    //instantiates what the method is
    model.remoteMethod('pending', {
        http: {path: '/pending', verb: 'post'},
        accepts: [
            {arg: 'tripId', type: 'string', description: 'An object for filtering matches.'}
        ],
        notes: "Testing out notes",
        description: "Returns a partial results list of the query.",
        returns: {type: 'object', root: true}
    });
    //what it actually does    
   
    model.pending = function(tripId, cb) {
        var RideRequests = model.app.models.RideRequests;
        var Users = model.app.models.SSFUsers;
        var async = require("async");
        
        model.find({
            where:{
                tripId:tripId,
                state:"pendDrCmt"
            }
        }, function(error, success) {
            console.log(error);
            console.log(success);
            getRideRequests(success);
        });
        
        function getRideRequests(returnArray) {
            async.forEachOf(returnArray, function (k, indexNum, next) {
            	RideRequests.find({
            		where: {
            			id: k.__data.rideId
            		}
            	},function(err, rideResponse) {
            		if(err) {
            			var error = new Error('async.forEach operation failed');
            			error.statusCode = 500;
            			next(error);
            		}
            		else {
            		    returnArray[indexNum] = rideResponse[0];
            			next();
            		}
            	});
            },function(err) {
            	if(err) {
            		var error = new Error('async.forEach operation failed');
            		error.statusCode = 500;
            		cb(error);
            	} 
            	getUsersCommited(returnArray);
            });
        }
        
        function getUsersCommited(returnArray){
            async.forEachOf(returnArray, function (k, indexNum, next){
                Users.find({
                    where: {
                        id: k.__data.riderId
                    }
                },function(err, riderResponse){
                    if(err){
                        var error = new Error('async.forEach operation failed');
            			error.statusCode = 500;
            			next(error);
                    }
                    else {
                        returnArray[indexNum].firstName = riderResponse[0].__data.firstName;
                        returnArray[indexNum].lastName = riderResponse[0].__data.lastName;
                        returnArray[indexNum].photo = riderResponse[0].__data.photo;    
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