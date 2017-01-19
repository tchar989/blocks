/*
	This function parses session files. Currently, it emits the body as a long string. This
	will be changed to parse out individual snapshots and world objects for easier readability.
*/

module.exports = function(path,callback)
{
	console.log("Parsing file... " + path);
	//synchronously read file data: no point in asynch as file data is crucial to the rest of module
	//catch error so entire server won't crash if this fails!
	if(!fs.existsSync(path))
		return callback(new Error("File not found."));
	else
		var filedata = fs.readFileSync(path, {encoding: 'utf-8'});
	//grab the metadata for the session and split using ';' as delimiter
	var metadata = filedata.substring(0,filedata.indexOf('[')-1);
	var filedata = filedata.substring(filedata.indexOf('['),filedata.length);
	var pieces = metadata.split(';');
	if(!(pieces[0]&&pieces[1]&&pieces[2]))
		return callback(new Error("File cannot be parsed - check the format"));
	//create session object for later upload
	var callbackobj = {
		'id' : pieces[0],
		'resetcount' : pieces[1],
		'author' : null,
		'date' : pieces[2],
		'body' : filedata
	};
	//return no errors and our parsed session object
	return callback(null, callbackobj);
	//SessionId;ResetCount;TimeStamp;data
};
