// var ridersApi = require('../../custom_api/matches/get-riders-by-trip.js');
var driverReservedRideApi = require('../../custom_api/matches/driver-reserved-ride.js');
var pendingApi = require('../../custom_api/matches/pending.js');
var historyRiderResultsApi= require('../../custom_api/matches/history-rider-results.js');
var rideMatchedRideApi = require('../../custom_api/matches/rider-matched-ride.js');
module.exports = function(Matches) {
    //pendingApi === new orbiting-like function... good luck.
    //pendingApi(Matches, path, state, notes, model, typeofid, method);
    pendingApi(Matches, 'riderPendingRide', 'pending',  'Testing out notes', 'RideRequests', 'tripId', "post");
    // pendingApi(Matches, 'driverReservedRide', 'reserved', 'returning committed riders', 'RideRequests', 'tripId', "get");
    pendingApi(Matches, 'riderMatchedTrip', 'matched', 'matching rider with trip', 'PostedTrips', 'rideId', "post");
    pendingApi(Matches, 'riderReservedTrip', 'reserved', 'matching rider with trip', 'PostedTrips', 'rideId', "post");
    //historyRiderApi(Matches, path, notes, typeofid, method);
    historyRiderResultsApi(Matches, 'historyRiderResults', 'Getting driver information for previous trip', 'rideId', "get");
    rideMatchedRideApi(Matches, 'riderMatchedRide', 'matched', 'matching rider with trip', 'PostedTrips', 'rideId', "get");
    driverReservedRideApi(Matches);
};