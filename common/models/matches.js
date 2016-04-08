// var ridersApi = require('../../custom_api/matches/get-riders-by-trip.js');
var pendingApi = require('../../custom_api/matches/pending.js');
module.exports = function(Matches) {
    pendingApi(Matches, 'pendDrCmt');
};

