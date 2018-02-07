function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);

	setTimeout(function(){
		cb(fake_responses[url]);
	},randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************
// The old-n-busted callback way
var arr = [false, false, false];
function getFile(file) {
	debugger;
	fakeAjax(file,function(text){
		debugger;
		index = file[file.length-1] - 1 // implicit coercion
		arr[index] = true;
		output(arr)
		output(text);
	});
}

// request all files at once in "parallel"
getFile("file1");
getFile("file2");
getFile("file3");
