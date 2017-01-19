/*
	Pass in database URL as first param, and schema object as second.
	This is intentionally decoupled to allow modularity
*/
   Sessions = require('./models/sessions.js');

module.exports = function(dbURL, scm, callback)
{
	mongoose.Promise = global.Promise;
	//check if mongoose already connected
	var options = { server: { socketOptions: { keepAlive: 600000, connectTimeoutMS: 60000 } }, 
                replset: { socketOptions: { keepAlive: 600000, connectTimeoutMS : 60000 } } };    
	if(mongoose.connection.readyState == 0)
	{
		console.log("Connected to database...");
		mongoose.connect(dbURL,options);
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
	query.update({id: newSession.id},{$setOnInsert: newSession}, {upsert: true}, function(err, numAffected)
	{
		console.log("Successfully uploaded file with id: " + newSession.id + " to database.");
	});
};





