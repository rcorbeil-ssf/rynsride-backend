// var ridersApi = require('../../custom_api/matches/get-riders-by-trip.js');
var pendingApi = require('../../custom_api/matches/pending.js');
var historyRiderResultsApi= require('../../custom_api/matches/history-rider-results.js');
module.exports = function(Matches) {
    //pendingApi === new orbiting-like function... good luck.
    //pendingApi(Matches, path, state, notes, model, typeofid, method);
    pendingApi(Matches, 'pending', 'pendDrCmt', 'Testing out notes', 'RideRequests', 'tripId', "post");
    pendingApi(Matches, 'driverReservedRide', 'reserved', 'returning committed riders', 'RideRequests', 'tripId', "get");
    pendingApi(Matches, 'riderMatchedRide', 'matched', 'matching rider with trip', 'PostedTrips', 'rideId', "get");
    historyRiderResultsApi(Matches, 'historyRiderResults', "Returns driver Info & trip info", "rideId", "get");
};