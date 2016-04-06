module.exports = function(Matches) {

    // filters: {
    //     where: {
    //         userId: 'someuseridstring123'
    //     }
    // }
    
    Matches.remoteMethod('pending', {
        http: {path: '/pending', verb: 'post'},
        accepts: [
            {arg: 'tripId', type: 'string', description: 'An object for filtering matches.'}
        ],
        notes: "Used to pull matched rides",
        description: "Returns a partial results list of the query.",
        returns: {type: 'object', root: true}
    });
        /*accepts: [
            {arg: 'passedInStuff', type: 'string'},
            // {arg: 'date', type: 'string', "required": true},
            // //{arg: 'modelName', type: 'string', "required": true},
            // {arg: 'limit', type: 'number'},
            {arg: 'filters', type: 'object'}
            // {arg: 'nextPage', type: 'number'},
            // {arg: 'unique', type: 'string', description: "description"}
        ],*/
    Matches.pending = function(tripId, cb) {
        var RideRequests = Matches.app.models.RideRequests;
        var Users = Matches.app.models.SSFUsers;
        var async = require("async");
        
        Matches.find({where:{tripId:tripId}}, function(error, success) {
            console.log(error);
            console.log(success);
            getRideRequests(success);
            
            
            
        });
        
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
                        //riderResponse[0].__data.firstName;
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
        // getRideRequests(instance);
        function getRideRequests(returnArray) {
            async.forEachOf(returnArray, function (k, indexNum, next) {
            // 	var responseName = 'response'+indexNum;
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
                // endService(returnArray, totalPages);
            });
        }
    };
};