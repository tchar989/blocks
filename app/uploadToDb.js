/*
	Pass in database URL as first param, and schema object as second.
	This is intentionally decoupled to allow modularity
*/
   Sessions = require('./models/sessions.js');

module.exports = function(dbURL, scm, callback)
{
	mongoose.Promise = global.Promise;


	var options = { server: { socketOptions: { keepAlive: 600000, connectTimeoutMS: 60000 } }, 
                replset: { socketOptions: { keepAlive: 600000, connectTimeoutMS : 60000 } } }; 

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

	/*
	* our query, which finds all database entries with the same id as the one we're prepping for upload
	* (no duplicates)
	* Note: query.update automatically disallows duplicates, however it is much quicker to first see
	* if the entry is a duplicate. Uploading to the database takes a significantly longer time.
	*/
	var query = Sessions.where({ id : scm.id });
	console.log("Searching database...");
	query.findOne(function(err, session)
	{
		if(err)
			return callback(new Error("Error: Could not parse database"));
		else if(session)
			return callback(new Error("File with id " + scm.id + " already in database."));
		else
			query.update({id: newSession.id},{$setOnInsert: newSession}, {upsert: true}, function(err, numAffected)
			{
				console.log("Successfully uploaded file with id: " + newSession.id + " to database.");
				return callback(null);
			});
	});
};





