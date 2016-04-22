//var historyRiderApi= require('../../custom_api/rideRequests/history-rider.js');
var computeMatches = require('../../custom_api/matches/compute-matches-requestRide.js');

module.exports = function(RideRequests) {

    //historyRiderApi(RideRequests);
    computeMatches(RideRequests);
};
