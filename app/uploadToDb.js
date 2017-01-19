/*
	Pass in database URL as first param, and schema object as second.
	This is intentionally decoupled to allow modularity
*/
   Sessions = require('./models/sessions.js');

module.exports = function(dbURL, scm, callback)
{
	mongoose.Promise = global.Promise;
	//check if mongoose already connected
	if(mongoose.connection.readyState == 0)
	{
		console.log("Connected to database...");
		mongoose.connect(dbURL);
	}
	scm = JSON.parse(scm);
	//create session model
	var newSession = new Sessions({
		id : scm.id,
		resetcount : scm.resetcount,
		author : scm.author,
		date : scm.date,
		body : scm.body
	});
	//attempt to find a database entry with the same id (prevent duplicates)
	var query = Sessions.where({ id : scm.id });
	console.log("Searching database...");
	/*query.update({id: newSession.id},{$setOnInsert: newSession}, {upsert: true}, function(err, numAffected)
	{
		console.log("Successfully uploaded file with id: " + newSession.id + " to database.");
	});*/
	query.findOne(function(err, session)
	{
		if(err)
			return callback(new Error("Error: Could not parse database"));
		else if(session)
			return callback(new Error("File with id " + scm.id + " already in database."));

		else
		{
			newSession.save(function(err)
			{
				if(err)
					return callback(new Error("Error: Could not save to database."));
				else
				{
					console.log("Succesfully uploaded " + scm.id + " to database.");
					return callback(null);
				}
			});
		}
	});
};





