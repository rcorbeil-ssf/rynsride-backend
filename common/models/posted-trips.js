var locationAllowed = require('../../custom_api/wizardActivity/locationAllowed.js');
var getNamesApi = require('../../custom_api/postedTrips.js');
var computeMatches = require('../../custom_api/matches/compute-matches.js');
var getDriverInfo = require('../../custom_api/driverInfo.js');


module.exports = function(PostedTrips) {
    locationAllowed(PostedTrips);
    computeMatches(PostedTrips);
    getDriverInfo(PostedTrips);
    getNamesApi(PostedTrips);
};