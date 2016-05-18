module.exports = function(Matches, path, state, notes, model, typeId, method, targetProperty, targetUser) {
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
            getRideRequests(success);
        });
        function getRideRequests(returnArray) {
            async.forEachOf(returnArray, function (k, indexNum, next) {
            	 targetModel.find({
            		where: {
            			id: k.__data[targetProperty]
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
            if(returnArray == undefined){
                var error = new Error('returnArray undefined');
                error.statusCode = 500;
                cb(error);  
                return;
            }
            async.forEachOf(returnArray, function (k, indexNum, next){
                if(k == undefined){
                    var error = new Error('returnArray k undefined');
                    error.statusCode = 500;
                    cb(error);  
                    return;
                }
                Users.find({
                    where: {
                        id: k.__data[targetUser]
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
                        returnArray[indexNum].age = riderResponse[0].__data.age;
                        returnArray[indexNum].gender = riderResponse[0].__data.gender;
                        returnArray[indexNum].ageRange = riderResponse[0].__data.ageRange;
                        returnArray[indexNum].sameSexOnly = riderResponse[0].__data.sameSexOnly;
                        returnArray[indexNum].likesDogs = riderResponse[0].__data.likesDogs;
                        returnArray[indexNum].cellPhone = riderResponse[0].__data.cellPhone;
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