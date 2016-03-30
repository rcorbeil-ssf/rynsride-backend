module.exports = function(app) {

	var jsonArr = require('../fakeData/fakePostedTrips.json');

	var Trip = app.models.PostedTrips;

	Trip.destroyAll();

	jsonArr.forEach(function(tripDict){
		Trip.create(tripDict, function(err, record) {
			if (err) return console.log(err);
		});
	});
	console.log("fake Trips inserted successfully");

};