var pendingApi = require('../../custom_api/matches/pending.js');
module.exports = function(Matches) {
    pendingApi(Matches, 'pendDrCmt');
};

var ridersApi = require('../../custom_api/matches/get-riders-by-trip.js');
module.exports = function(Matches) {
    ridersApi(Matches);
};

