// var ridersApi = require('../../custom_api/matches/get-riders-by-trip.js');
var pendingApi = require('../../custom_api/matches/pending.js');
var historyRiderResultsApi= require('../../custom_api/matches/history-rider-results.js');
var rideMatchedRideApi = require('../../custom_api/matches/rider-matched-ride.js')
module.exports = function(Matches) {
    // pendingApi === new orbiting-like function... good luck.
    // pendingApi(Matches, path, state, notes, model, typeofid, method);
    pendingApi(Matches, 'riderPendingRide', 'pending',  'Testing out notes', 'PostedTrips', 'rideId', "post", 'tripId', 'driverId');
    
    pendingApi(Matches, 'riderMatchedTrip', 'matched', 'matching rider with trip', 'PostedTrips', 'rideId', "post", 'tripId', 'driverId');
    
    pendingApi(Matches, 'riderReservedTrip', 'reserved', 'matching rider with trip', 'PostedTrips', 'rideId', "post", 'tripId', 'driverId');
    
    pendingApi(Matches, 'driverPendingRide', 'pending',  'Testing out notes', 'RideRequests', 'tripId', "post", 'rideId', 'riderId');
    
    pendingApi(Matches, 'driverReservedRide', 'reserved', 'returning committed riders', 'RideRequests', 'tripId', "post", 'rideId', 'riderId');
    
    //historyRiderApi(Matches, path, notes, typeofid, method);
    historyRiderResultsApi(Matches, 'historyRiderResults', 'Getting driver information for previous trip', 'rideId', "get");
    rideMatchedRideApi(Matches, 'riderMatchedRide', 'matched', 'matching rider with trip', 'PostedTrips', 'rideId', "get");
};