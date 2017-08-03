function WhoUB(){
//	this.sendText = $('#send-text');
	this.sendText = document.getElementById('send-text');
	this.inputText = $('#input-text');

	this.sendText.addEventListener('click', this.analyzeText.bind(this));


}

WhoUB.prototype.analyzeText = function(){
	var inputText = this.inputText.val().trim();
	if (inputText != "") {
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://utcors1.herokuapp.com/https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyAjapmLhqEBFwEd5He9XZXCDP50Ew_GZiU",
	  "method": "POST",
	  "headers": {
	    "content-type": "application/json",
	    "cache-control": "no-cache",
	    "postman-token": "e21e47e7-3460-0e59-1267-4042c8af2893"
	  },
	  "processData": false,
	  "data": "{\r\n \"document\": {\r\n  \"content\": \"" + inputText +"\",\r\n  \"type\": \"PLAIN_TEXT\"\r\n },\r\n \"encodingType\": \"UTF8\"\r\n}"
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});	
		
	}

}

var x = new WhoUB();