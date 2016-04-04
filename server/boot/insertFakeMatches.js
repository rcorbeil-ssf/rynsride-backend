module.exports = function(app) {

	var jsonArr = require('../fakeData/fakeMatches.json');

	var Match = app.models.Matches;

	Match.destroyAll();

	jsonArr.forEach(function(jsonArr){
		Match.create(jsonArr, function(err, record) {
			if (err) return console.log(err);
		});
	});
	console.log("fake Matches inserted successfully");

};