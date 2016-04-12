module.exports = function(model) {

// This hook runs after the PostedTrip instance has been added to the PostedTrips model
// It searches for any matching RequestRides instances.  If any found, it adds an
// instance to the Matches model.
model.observe('after save', function(ctx, next) {
	if (ctx.instance) {
	  console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
	} else {
	  console.log('Updated %s matching %j',
	    ctx.Model.pluralModelName,
	    ctx.where);
	}
	RideRequests = model.app.models.RideRequests;
	Matches = model.app.models.Matches;
	

	var async = require("async");
	//TODO check for undefined values in inputs...
	//TODO filter by startTime also...
	
	// Search for matching Ride requests
	RideRequests.find({
		where:{
			startGeopoint:
				{maxDistance: ctx.instance.__data.pickupRadius
				near:	{lat: ctx.instance.__data.startGeopoint.lat, lng: ctx.instance.__data.startGeopoint.lng 
				}},
			destGeopoint:
				{maxDistance: ctx.instance.__data.pickupRadius
				  near:	{lat: ctx.instance.__data.destGeopoint.lat, lng: ctx.instance.__data.destGeopoint.lng 
					
				}},
			state: "new",
			startDate: ctx.instance.__data.startDate
		}
	}, function(error, success){
		createMatches(success);
	});
	
	// Create instance(s) in the Matches model
	function createMatches(foundArray) {
		async.forEachOf(foundArray, function (k, indexNum, next){
			var properties = {
				tripId: ctx.instance.__data.id,
				rideId: k.id,
				dateStamp: ctx.instance.__data.startDate,
				state: ctx.instance.__data.state
			};
			
			Matches.create(properties, function(err, tripRes){
				if(err) {
					var error = new Error('async.forEach operation failed trips response error');
					error.statusCode = 500;
					next(error);
				}
				else {
					 next();
				}
			});
		}, function(err) {
		    if(err) {
		    	var error = new Error('async.forEach operation failed general error');
        		error.statusCode = 500;
        		console.log(error);
		    }
		});
	}
	next();
	}
)};

