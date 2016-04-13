module.exports = function(RideRequests) {
    // instantiates what the method is
    RideRequests.remoteMethod('historyRider', {
        http: {path: '/historyRider', verb: 'GET'},
        accepts: [
            {arg: 'riderId', type: 'string', description: 'An object for filtering riderequests.'}
        ],
        notes: "Retrieving past trips of User",
        description: "Returns a partial results list of the query.",
        returns: {type: 'array', root: true}
    });
     RideRequests['historyRider'] = function(passedId, cb) {
        var currentDate = new Date().toUTCString();
        var async = require("async");
        var tempObj = {
            where:{
                riderId: passedId,
                startDate: {lt: currentDate}
            }
        };
        RideRequests.find(tempObj, function(error, success) {
            updateRideRequests(success);
            return success;
        });
        function updateRideRequests(returnArray){
            async.forEachOf(returnArray, function(k, indexNum, next){
               if(k.state == 'pending' || k.state == 'new'){
                    k.state = 'canceled';
                } else if(k.state == 'started') {
                    k.state = 'ended';
                }
                RideRequests.upsert(k, cb); 
            });
        }
    };
};