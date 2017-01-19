
var fs = require('fs');

module.exports = function(filename)
{
	fs.unlink(filename);
};