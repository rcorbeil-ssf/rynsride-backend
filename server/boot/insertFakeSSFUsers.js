module.exports = function(app) {

	var jsonArr = require('../fakeData/fakeSSFUsers.json');

	var Users = app.models.SSFUsers;

	Users.destroyAll();

	jsonArr.forEach(function(userDict){
		Users.create(userDict, function(err, record) {
			if (err) return console.log(err);
		});
	});
	console.log("fake SSF-Users inserted successfully");

};