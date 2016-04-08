var pendingApi = require('../../custom_api/matches/pending.js');
module.exports = function(Matches) {
    pendingApi(Matches, 'pending');
    pendingApi(Matches, 'reserved');
};