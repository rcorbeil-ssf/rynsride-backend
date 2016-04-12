var locationAllowed = require('../../custom_api/wizardActivity/locationAllowed.js');
var getNames = require('../../custom_api/postedTrips.js');

module.exports = function(PostedTrips) {
    locationAllowed(PostedTrips);
    getNames(PostedTrips);
};
