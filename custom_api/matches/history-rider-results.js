module.exports = function(Matches, path, notes, rideId, method) {
    //instantiates what the method is
    Matches.remoteMethod(path, {
        http: {path: '/'+path+'/', verb: method},
        accepts: [
            {arg: rideId, type: 'string', description: 'An object for filtering matches.'}
        ],
        notes: notes,
        description: "Returns a partial results list of the query.",
        returns: {type: 'object', root: true}
    });
    //what it actually does    
    
    Matches[path] = function(passedId, cb) {
        var postedTrips = Matches.app.models.PostedTrips;
        var Users = Matches.app.models.SSFUsers;
        var Vehicles = Matches.app.models.Vehicles;
        var driver;
        var vehicle;
        var selectedPostedTrip;
        var tempObj = {
            where:{
                rideId: passedId
            }
        };
        Matches.findOne(tempObj, function(error, success) {
            if (error){
                var err = new Error('unable to find matching match object in matches model. match. match. match. match.');
                err.statusCode=500;
            } else {
                getDriverId(success);
                return driver;
            }
        });
        function getDriverId(matchesArray) {
            	 postedTrips.findOne({
            		where: {
            			id: matchesArray.tripId
            		}
            	},function(err, rideResponse) {
            		if(err) {
            			var error = new Error('async.forEach operation failed');
            			error.statusCode = 500;
            		}
            		else {
            		    selectedPostedTrip = rideResponse;
            			getDriverInfo(selectedPostedTrip.driverId);
            		}
            	});
        }
        
        // This function is used to get the User Model pertaining to
        // the driver of the selected trip, using his driver Id.
        function getDriverInfo(userId){
                Users.findOne({
                    where: {
                        id: userId
                    }
                },function(err, driverResponse){
                    if(err){
                        var error = new Error('Unable to retrieve driver info');
            			error.statusCode = 500;
                    }
                    else {
                        driver = driverResponse;
                        //getVehicleInfo(selectedPostedTrip.vehicleId);
                    }
                });
        }
        function getVehicleInfo(vehicleId){
                Vehicles.findOne({
                    where: {
                        id: vehicleId
                    }
                },function(err, vehicleResponse){
                    if(err){
                        var error = new Error('Unable to retrieve vehicle info');
            			error.statusCode = 500;
                    }
                    else {
                        vehicle = vehicleResponse;
                    }
                });
        }   
    };
};