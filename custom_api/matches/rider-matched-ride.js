module.exports = function(Matches, path, state, notes, model, typeId, method) {
    //instantiates what the method is
    Matches.remoteMethod(path, {
        http: {path: '/'+path, verb: method},
        accepts: [
            {arg: 'passedId', type: 'string', description: 'An object for filtering matches.'}
        ],
        notes: notes,
        description: "Returns a partial results list of the query.",
        returns: {type: 'object', root: true}
    });
    //what it actually does    
    
    Matches[path] = function(passedId, cb) {
        var targetModel = Matches.app.models[model];
        var Users = Matches.app.models.SSFUsers;
        var async = require("async");
        var tempObj = {
            where:{
                state: state
            }
        };
        tempObj.where[typeId] = passedId;
        Matches.find(tempObj, function(error, success) {
            getMatchedTrips(success);
        });
        function getMatchedTrips(returnArray) {
            async.forEachOf(returnArray, function (k, indexNum, next) {
            	 targetModel.find({
            		where: {
            			id: k.__data['tripId']
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
            	getDriverInfo(returnArray);
            });
        }
        
        function getDriverInfo(returnArray){
            async.forEachOf(returnArray, function (k, indexNum, next){
                Users.find({
                    where: {
                        id: k.__data.driverId
                    }
                },function(err, driverResponse){
                    if(err){
                        var error = new Error('async.forEach operation failed');
            			error.statusCode = 500;
            			next(error);
                    }
                    else {
                        returnArray[indexNum].firstName = driverResponse[0].__data.firstName;
                        returnArray[indexNum].lastName = driverResponse[0].__data.lastName;
                        returnArray[indexNum].photo = driverResponse[0].__data.photo;
                        returnArray[indexNum].age = driverResponse[0].__data.age;
                        returnArray[indexNum].gender = driverResponse[0].__data.gender;
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