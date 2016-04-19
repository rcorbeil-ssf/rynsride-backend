module.exports = function(app) {

	var jsonArr = require('../fakeData/fakeSSFUsers.json');

	var Users = app.models.SSFUsers;

	// Users.destroyAll();

	
	// 	Users.create(jsonArr, function(err, record) {
	// 		if (err) return console.log(err);
	// 	});
	
	console.log("fake SSF-Users inserted successfully");

};