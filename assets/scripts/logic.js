function WhoUB(){
//	this.sendText = $('#send-text');
	this.sendText = document.getElementById('send-text');
	this.inputText = $('#input-text');

	this.sendText.addEventListener('click', this.analyzeText.bind(this));
}

WhoUB.prototype.analyzeText = function(){
	$.ajax({
		url: '',
		method: 'GET'
	}).done(function(){});
	console.log(this.inputText.val());
}

var x = new WhoUB();