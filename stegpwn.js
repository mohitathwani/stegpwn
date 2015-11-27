if (process.argv.length != 4) {
	console.log("Expected usage: stegpwn [imageFile] [dictionaryFile]");
}

else {
	var imageFile = process.argv[2];
	var dictionaryFile = process.argv[3];

	var lineReader = require('line-reader');
	var Promise = require('bluebird');
	var exec = require('child_process');

	var eachLine = Promise.promisify(lineReader.eachLine)
	eachLine(dictionaryFile, function(line, last){
		
		var stegHideCommand = "steghide extract -sf "+imageFile+" -p "+line;
		
		exec.exec(stegHideCommand, function(err, stdout, stderr){
			if(stderr.toString().indexOf('wrote') > -1) {
				console.log("Password is: "+line);
				console.error(stderr);
				process.exit();
			}

			if (last) {
				console.log("\n\n\n\n----->No password found<-----\n\n\n\n");
			}
		});
		

		
	}).then(function() {
		//console.log("\n\n\n\n----->No password found<-----\n\n\n\n")
	}).catch(function(err){
		console.error(err.message);
		process.exit();
	});
}
