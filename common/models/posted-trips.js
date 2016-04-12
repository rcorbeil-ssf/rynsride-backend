var locationAllowed = require('../../custom_api/wizardActivity/locationAllowed.js');
var computeMatches = require('../../custom_api/matches/compute-matches.js');
module.exports = function(PostedTrips) {
    locationAllowed(PostedTrips);
    computeMatches(PostedTrips);
  
};
