function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	//console.log("Requesting: " + url);

	setTimeout(function(){
		response = fake_responses[url]; 
		this.filereq = url;
		cb(response);
		
	},randomDelay);
}

function print(text) {
	console.log(text);
}

// **************************************
// The old-n-busted callback way


function getFile(file) {

	usher.checkIn(file);
	fakeAjax(file,function(text){
		// callback once reponse arrived
		print(this.filereq + " arrived");
		filenum = convertReq2Number(file);
		// when request has returned, put it on the queue
		responses[filenum - 1 ] = text;
		usher.updatePendingStatus(filenum)
		var isnext = usher.checkFirstInLine(filenum);
		isnext ? usher.wakeUp(filenum) : null;

	});
}


responses = []
var usher = Usher();

// request all files at once in "parallel"
getFile("file1");
getFile("file2");
getFile("file3");


// handles the line / queue of requests
function Usher(){
	var next = 1;
	var line = [];
	var cnt = 0;
	var pendings = []

	var api = {
		checkPending,
		updatePendingStatus,
		checkIn,
		checkFirstInLine,
		wakeUp,
	};

	return api;

	function checkIn(file){
		
		pendings[cnt] = true;
		var req = Req(file);
		// if it's the first request make it the first in line
		!cnt ? req.makePropagator() : null;
		line.push(req);
		cnt++;	
		
	}

	function updatePendingStatus(index){
		pendings[index - 1] = false;
	}

	function checkPending(index){
		return pendings[index];
	}

	function checkFirstInLine(place){
		return next == place;
	}

	function wakeUp(index){
		line[index-1].wakeUp(index);
		next++;
		if(next > line.length) return;
		if (!pendings[index])
			wakeUp(index + 1);
	}

}

function Req(filenum){
	
	var propagator = false;
	var value;
	var file_request = filenum;

	function getFileRequest(){
		return file_request
	}

	function makePropagator(){
		propagator = true;
	}

	function isPropagator(){

		return propagator;
	}

	function wakeUp(index){
		print(responses[index - 1]);
	}

	var api = {
		getFileRequest,
		isPropagator,
		makePropagator,
		wakeUp,

	}
	return api;
}

function convertReq2Number(str){
	return Number(str[str.length -1]);
}

