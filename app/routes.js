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
    removeFile = require('./removeFile.js')

router.post('/upload', function(req,res)
{
	var worker = process.spawn
	var form = formidable.IncomingForm({uploadDir : "tmp", encoding: 'utf-8'});
	var filename = tmpPath.path + "session" + process.pid + ".txt";
	form.on('fileBegin', function(name,file)
	{
		file.path = filename;
	});
	form.parse(req);
	form.on('end', function()
	{
		var newSession;

		parseSess(filename, function(err, sess)
		{
			if(err)
			{
				console.log("Error: " + err.message);
				fs.unlink(filename, function(err)
				{
					if(err)
					console.log("Error: Could not unlink: " + filename);
					res.redirect("/")
				});
			}
			else
			{
				//Spin up new process to concurrently handle database upload and respond with an error code
				uploadToDb(configDB.url, JSON.stringify(sess), function(err)
				{
					if(err)
						console.log(err.message);
					fs.unlink(filename, function(err)
					{
						if(err)
							console.log("Error: Could not unlink: " + filename);
						res.redirect("/")
					});
				});
			}
		});
	});
	console.log("hi");
});
router.get("/", function(req,res)
{
	res.render('index.html');
});


module.exports = router;