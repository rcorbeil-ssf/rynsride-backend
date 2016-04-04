module.exports = function(app) {

	var jsonArr = require('../fakeData/fakeRideRequests.json');

	var RideRequest = app.models.RideRequests;

	RideRequest.destroyAll();

	jsonArr.forEach(function(jsonArr){
		RideRequest.create(jsonArr, function(err, record) {
			if (err) return console.log(err);
		});
	});
	console.log("fake RideRequests inserted successfully");

};