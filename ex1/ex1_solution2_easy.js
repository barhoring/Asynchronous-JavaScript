
function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);
	setTimeout(function(){
		cb(url, fake_responses[url]);
	},randomDelay);
}

function print(text) {
	console.log(text);
}

// **************************************
// The old-n-busted callback way
var next = 0;
var arrivals = [];
fill(arrivals, 3, false);

var responses = [];

function getFile(file) {
	fakeAjax(file,function(url, text){
		var index = Number(url[url.length - 1]) -1;
		// print("requested: " + url + " , got: " + text);

		// store the response and mark as arrivedd
		arrivals[index] = true;
		responses[index] = text;
		// propagate the print if possible
		while(index == next){
			print(responses[index]);
			next++;
			if(!arrivals[index + 1]) return;
			index++;
		}

	});
}

// request all files at once in "parallel"
getFile("file1");
getFile("file2");
getFile("file3");


function fill(arr, size, init_val){
	var val = typeof init_val == 'undefined' || init_val;
	for(let i = 0; i < size; i++)
		arr[i] = val;
}
