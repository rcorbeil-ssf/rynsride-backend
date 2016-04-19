module.exports = function(app) {

	var jsonArr = require('../fakeData/fakePostedTrips.json');

	var Trip = app.models.PostedTrips;

	// Trip.destroyAll();

	// Trip.create(jsonArr, function(err, record) {
	// 	if (err) return console.log(err);
	// });
	console.log("fake Trips inserted successfully");

};