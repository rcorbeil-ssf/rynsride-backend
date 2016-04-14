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
	    return(""); // ignore coming into this hook after updating our own model (PostedTrips) below
	}
	var RideRequests = model.app.models.RideRequests;
	var Matches = model.app.models.Matches;
	var PostedTrips = model.app.models.PostedTrips;
	
	var async = require("async");
	
	// Search for matching Ride requests
	if( ctx.instance.__data.startGeopoint == undefined ||
		ctx.instance.__data.destGeopoint == undefined ||
		ctx.instance.__data.pickupRadius == undefined ||
		ctx.instance.__data.startDate == undefined ||
		ctx.instance.__data.startTime == undefined) {
			var error = new Error('Invalid input arguments to PostedTrip');
        	error.statusCode = 500;
        	console.log(error);
	} else {
		THIRTY_MINUTES = 30 * 60 * 1000;  // milliseconds
		
		console.log(ctx.instance.__data.startDate);
		console.log(ctx.instance.__data.startTime);
		console.log(ctx.instance.__data.startTime + THIRTY_MINUTES);
		console.log(ctx.instance.__data.startTime - THIRTY_MINUTES);
		
		var year = ctx.instance.__data.startDate.getUTCFullYear();
		var month = ctx.instance.__data.startDate.getUTCMonth();
		var day = ctx.instance.__data.startDate.getUTCDate();
		// convert to UTC format, lose hrs, min, secs
		ctx.instance.__data.startDate.setTime(Date.UTC(year, month, day));
		console.log(ctx.instance.__data.startDate);
		
		RideRequests.find({
			where:{
				startGeopoint:
					{maxDistance: ctx.instance.__data.pickupRadius,
					near:	{lat: ctx.instance.__data.startGeopoint.lat, lng: ctx.instance.__data.startGeopoint.lng 
					}},
				destGeopoint:
					{maxDistance: ctx.instance.__data.pickupRadius,
					  near:	{lat: ctx.instance.__data.destGeopoint.lat, lng: ctx.instance.__data.destGeopoint.lng 
					}},
				or:[	
					{state: "new"},
					{state: "matched"}
				   ],
				startDate: ctx.instance.__data.startDate,
				and:[
				 	{startTime: {gte:  ctx.instance.__data.startTime - THIRTY_MINUTES}},
				 	{startTime: {lte:  ctx.instance.__data.startTime + THIRTY_MINUTES}}
				    ]					
			}
		}, function(error, success){
			createMatches(success);
		});
		
		// Create instance(s) in the Matches model
		function createMatches(foundArray) {
			async.forEachOf(foundArray, function (k, indexNum, next){

				console.log('Match found for rideId' + k.id);
				
				var properties = {
					tripId: ctx.instance.__data.id,
					rideId: k.id,
					dateStamp: ctx.instance.__data.startDate,
					updateStamp: new Date(),
					state: "matched"
				};
				
				Matches.create(properties, function(err, match){
					if(err) {
						var error = new Error('async.forEach operation failed trips response error');
						error.statusCode = 500;
						next(error);
					}
					else {
						// Update state of RideRequest to 'matched'
						var stateProperty = {
							state: "matched"
						};
						RideRequests.update({id: k.id},stateProperty, function(err, rRequest){
							if(err) {
								var error = new Error('Unable to update rideRequest to "matched"');
								error.statusCode = 500;
								next(error);								
							} else {
								PostedTrips.update({id: ctx.instance.__data.id},stateProperty, function(err, pTrip){
									if(err) {
										var error = new Error('Unable to update postedTrip to "matched"');
										error.statusCode = 500;
										next(error);								
									} else {
										next();
									}
								});
							}
						});
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
	}
)};

