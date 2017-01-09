var express = require('express');
	mongoose = require('mongoose');
	fs = require('fs');
	router = express.Router();
	formidable = require('formidable');
    configDB = require('../config/database');
    fork = require('child_process').fork;
    Sessions = require('./models/sessions.js');
    parseSess = require('./parseSession.js');
    tmpPath = require('../config/temp.js');
    uploadToDb = require('./uploadToDb.js');

router.post('/upload', function(req,res)
{
	var form = formidable.IncomingForm({uploadDir : "tmp", encoding: 'utf-8'});
	var filename = tmpPath.path + "/session.txt";
	form.on('fileBegin', function(name,file)
	{
		file.path = tmpPath.path + "/session.txt";
	});

	form.parse(req)
	{
		var newSession;
		parseSess(filename, function(err, sess)
		{
			if(err)
			{
				console.log("Error: Unable to parse file!");
				res.send("Error: Unable to parse file!");
				return;
			}
			else
			{
				//Spin up new process to concurrently handle database upload and respond with an error code
				uploadToDb(configDB.url, JSON.stringify(sess), function(err)
				{
					if(err)
						//write html page for this...
						res.write("Error uploading to database.");
				});
			}
		});
	}
});
router.get("/", function(req,res)
{
	res.render('index.html');
});

module.exports = router;