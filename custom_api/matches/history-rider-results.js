//discreptency #1 the 'path' passed in does not match exactly what is passed in if it were to be different than "rideId" on line 27:17
//discreptency #2 what the heck is this: .limit(1) on line 47:16, 66:19, and 81:19
//discreptency #3 line 55 is weird
//discreptency #4 you're never calling the cb    
module.exports = function(Matches, path, notes, rideId, method) {
    //instantiates what the method is
    Matches.remoteMethod(path, {
        http: {path: '/'+path, verb: method},
        accepts: [
            {arg: rideId, type: 'string', description: 'An object for filtering matches.'}
        ],
        notes: notes,
        description: "Returns one result.",
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
            where:{rideId: passedId}, //discreptency #1
            or: [
                {state: "started"}, 
                {state: "ended"}
                ]
        };
        Matches.find(tempObj, function(error, success){
                if (error){
                    var err = new Error('Error: Need more vespene gas');
                    err.statusCode = 500;
                } else {
                    console.log(success);
                    getDriverId(success);   
                }
        });
        function getDriverId(matchesArray) {
            	 postedTrips.find({
            		where: {
            			id: matchesArray[0].tripId
            		}
            	},function(err, rideResponse) {
            		if(err) {
            			var error = new Error('async.forEach operation failed');
            			error.statusCode = 500;
            		}
            		else {
            		    selectedPostedTrip = rideResponse[0];
            			getDriverInfo(selectedPostedTrip.driverId);
            		}
            	}); //discreptency #2
        }
        
        // This function is used to get the User Model pertaining to
        // the driver of the selected trip, using his driver Id.
        function getDriverInfo(userId){
                Users.find({
                    where: {
                        id: userId
                    }
                },function(err, driverResponse){
                    if(err){
                        var error = new Error('Unable to retrieve driver info');
            			error.statusCode = 500;
                    }
                    else {
                        driver = driverResponse[0];
                        getVehicleInfo(driver.id);
                        console.log(driverResponse);
                    }
                });
        }
        function getVehicleInfo(driverId){
                Vehicles.find({
                    where: {
                        userId: driverId
                    }
                },function(err, vehicleResponse){
                    if(err){
                        var error = new Error('Unable to retrieve vehicle info');
            			error.statusCode = 500;
                    }
                    else {
                        vehicle = vehicleResponse[0];
                        cb(0, {driver: driver, vehicle: vehicle, trip: selectedPostedTrip});
                    }
                });
        }   
    };
};