/*
	Pass in database URL as first param, and schema object as second.
	This is intentionally decoupled to allow modularity
*/
   Sessions = require('./models/sessions.js');

module.exports = function(dbURL, scm, callback)
{
	console.log("uploading to DB...");
	mongoose.Promise = global.Promise;
	//check if mongoose already connected
	if(mongoose.connection.readyState == 0)
	{
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
	query.findOne(function(err, session)
	{
		if(err)
		{
			console.log("Error: Could not parse database.");
			return callback(err);
		}
		else if(session)
		{
			//found another file in DB with same ID! No duplicates
			console.log("File with id " + scm.id + " already in database.");
		}
		else
		{
			newSession.save(function(err)
			{
				if(err)
				{
					console.log("Error: Could not save to database.");
					return callback(err);
				}
				else
				{
					console.log("Succesfully uploaded " + scm.id + " to database.");
				}
			});
		}
	});
};





