var express = require('express');
	routes = require('./app/routes.js')
    exec = require('child_process').exec;
    configDB = require('./config/database');

var app = express();
app.use(express.static('./views'));
app.use(routes);

//Heroku gives us our port via process.argv[2]. Otherwise if no port given, run on localhost:5000.
app.listen(process.argv[2] || 5000);
