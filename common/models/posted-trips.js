var locationAllowed = require('../../custom_api/wizardActivity/locationAllowed.js');
var getNamesApi = require('../../custom_api/postedTrips.js');

module.exports = function(PostedTrips) {
    locationAllowed(PostedTrips);
    getNamesApi(PostedTrips);
};
