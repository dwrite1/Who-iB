var tempOutput;

function WhoUB() {
	//get DOM elements
	this.sendText = document.getElementById('send-text');
	this.signInButton = document.getElementById('login-button');
	this.signOutButton = document.getElementById('sign-out');
	this.modalDelete = document.getElementById('modal-delete-button');
	this.modalClose = document.getElementById('modal-close-button');
	this.snipDetails = document.getElementsByClassName('card-info');

	this.inputText = $('#input-text');
	this.loginDiv = $('#logged-out-stuff');
	this.profileDiv = $('#logged-in-stuff');
	this.displayTone = $('#tone-information');
	this.userWelcome = $('#user-welcome');
	this.curDate = $('#current-date');
	this.curText = $('#current-text');
	this.curScore = $('#current-score');
	this.curMagnitude = $('#current-magnitude');
	this.modal = $('#sentimentModal');
	this.modalText = $('#modal-text');
	this.modalDate = $('#modal-date');
	this.modalScore = $('#modal-score');
	this.modalMagnitude = $('#modal-magnitude');

	//add event listeners to DOM elements and bind them to the object's namespace
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.sendText.addEventListener('click', this.analyzeText.bind(this));
	this.modalClose.addEventListener('click', this.closeModal.bind(this));
	this.modalDelete.addEventListener('click', this.deleteSentiment.bind(this));

	$('.card-info').on('click', function(item) {
		console.log(item)
	});
	this.displaySentimentHistory.bind(this);
	this.pushToFirebase.bind(this);
	this.Snippet = function(text, score = 0, magnitude = 0) { //Object to hold individual user inputs
		this.text = text;
		this.time = new Date().toLocaleString('en-US')
		this.score = score;
		this.magnitude = magnitude;
	}
	this.texts = []; 				//holds all user input
	//current user info
	this.uid = null, this.profilePicUrl = "", this.userName = "";

	//firebase initialization
	this.config = {
		apiKey: "AIzaSyAq8BljGpg_85mt8OWD4ndWaQGxFnXVpIE",
		authDomain: "bootcampproject1.firebaseapp.com",
		databaseURL: "https://bootcampproject1.firebaseio.com",
		projectId: "bootcampproject1",
		storageBucket: "bootcampproject1.appspot.com",
		messagingSenderId: "258703035332"
	};
	firebase.initializeApp(this.config);
	//get firebase services
	this.storage = firebase.storage();
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.users = 'users/'; 			//location of all users
	this.snippets = 'snippets/'; 	//location of all analyzed text
	this.loginDiv.hide();
	this.profileDiv.hide();

	//called when someone logs in or out
	this.onAuthStateChanged = function(user) {
		if (user) { 				// User is signed in!
			this.loginDiv.hide(); 	// hide login button
			this.profileDiv.show();
			this.uid = user.uid; 	// get user info from google auth
			this.profilePicUrl = user.photoURL;
			this.userName = user.displayName;

			//look for the user based on UID
			this.database.ref(this.users + this.uid).once('value') //check if we have their data
				.then(function(snapshot) {
					if (snapshot.val() == null) { //User not in DB so add them
						console.log("account doesn't exist");
						//write to firebase
						this.pushToFirebase();
						// let uName = this.userName; //new vars b/c set doesn't like dots
						// let uPic = this.profilePicUrl;
						// let uTexts = this.texts;
						// this.database.ref(this.users + this.uid).set({
						// 	uName,
						// 	uPic,
						// 	uTexts
						// });
						//write user info into firebase
					} else { //user exists, get their info    		
						console.log(snapshot.val().uName + " is in our Database");
						if (snapshot.val().uTexts != undefined) {
							this.texts = snapshot.val().uTexts;
							this.displaySentimentHistory();
						}
						this.userWelcome.html(this.userName);
					}
				}.bind(this));
		} else { //user logged out - hide profile info and show login
			console.log("logged out");
			this.profileDiv.hide();
			this.loginDiv.show();
		}
	}
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this)); //send any auth changes to Google's obj
}

WhoUB.prototype.deleteSentiment = function(e) {
	this.texts.splice($(e.target).attr("data-key"), 1);
	this.pushToFirebase();
	this.modal.foundation('close');
}

WhoUB.prototype.closeModal = function() {
	this.modal.foundation('close');
}

//show historical sentiments in the sentiment div
WhoUB.prototype.displaySentimentHistory = function() {
	$('#sentiments-eq').html("");
	let sentimentContainer, calloutClass, curSentiment;
	for (key in this.texts) {
		sentimentContainer = $('<div class="medium-3 cell">');
		calloutClass = "secondary";
		if (this.texts[key].score > .6 && this.texts[key].magnitude > 1) {
			calloutClass = "success";
		} else if (this.texts[key].score < 0 && this.texts[key].magnitude > 0) {
			calloutClass = "alert";
		}

		curSentiment = sentimentContainer.html($('<div class="card-info" data-equalizer-watch ' +
				//evenlistener to handle user clicking a sentiment snippet
				'data-key="' + key + '">').click(function(e) {
				let curSnippet = $(e.currentTarget).attr("data-key");
				let snippetToExpand = this.texts[curSnippet];
				//put the current sentiment info in the modal				
				this.modalText.html(snippetToExpand.text);
				this.modalDate.html(snippetToExpand.time);
				this.modalScore.html(snippetToExpand.score);
				this.modalMagnitude.html(snippetToExpand.magnitude);
				$(this.modalDelete).attr('data-key', curSnippet)
				this.modal.foundation('open');
			}.bind(this)) //Wrap data in a card and add key as attribute
			.addClass(calloutClass).html($('<div class="card-info-label">')
				.append($('<div class="card-info-label-text">').html(this.texts[key].score))) //add score as label
			.append($('<div class="card-info-content">').html('<p>' + this.texts[key].text + '</p>')) //inject text
		);

		$('#sentiments-eq').prepend(curSentiment); //append the card to whats already there
	}
}

//when user clicks a snippet from history
WhoUB.prototype.showSnipDetails = function(e) {
	let snippetToExpand = $(val.currentTarget).attr("data-key");
}

//GoogApp method to allow users to sign in
WhoUB.prototype.signIn = function(e) {
	e.preventDefault();
	var provider = new firebase.auth.GoogleAuthProvider();
	this.auth.signInWithPopup(provider);
}

//GoogApp method to allow users to sign out  
WhoUB.prototype.signOut = function(e) {
	e.preventDefault();
	this.auth.signOut();
	console.log("signed out");
}

// analizes all text for watson API
WhoUB.prototype.analyzezPersonality = function(e) {
	//Get text and combine into string
	var combinedText = "";
	var keys = this.texts.keys;
	for (var i = 0; i < this.texts.length; i++) {
		var textObject = this.texts[i];
		combinedText += textObject.text + " ";
	}

	//calculate if the text is over the amount;
	//should use a modal on this
	var minimumLength = 600;
	if (combinedText.length < minimumLength) {
		alert("You need more text to get an accurate read on your personality");
		return;
	}

	$.ajax({
		url: 'https://watson-easy.herokuapp.com/profile',
		type: 'POST',
		dataType: 'JSON',
		data: {
			content: combinedText
		}
	}).done(res => {
		console.log("text: ");
		console.log(res);
		console.log("personality: ");
		console.log(res.personality);

		var personalityDiv = $("#personality");
		let oPercent = Math.floor(res.personality[0].percentile*100);
		let cPercent = Math.floor(res.personality[1].percentile*100);
		let ePercent = Math.floor(res.personality[2].percentile*100);
		let aPercent = Math.floor(res.personality[3].percentile*100);
		let emPercent = Math.floor(res.personality[4].percentile*100);

		$('#openness-graph').attr("style", 'height:'+oPercent+'%;');
		$('#conscientiousness-graph').attr("style", 'height:'+cPercent+'%;');
		$('#extraversion-graph').attr("style", 'height:'+ePercent+'%;');
		$('#agreeableness-graph').attr("style", 'height:'+aPercent+'%;');
		$('#emotional-graph').attr("style", 'height:'+emPercent+'%;');
		$('#o-percent').html(oPercent);
		$('#c-percent').html(cPercent);
		$('#e-percent').html(ePercent);
		$('#a-percent').html(aPercent);
		$('#em-percent').html(emPercent);

		for (var i = 0; i < res.personality.length; i++) {
			var personality = res.personality[i];
			var personalityInfo = $("<div>");

			//add children to div 
			var personalityName = $("<p>").html(personality.name);
			var personalityPercentile = $("<p>").html(personality.percentile);

			personalityDiv.append(personalityName, personalityPercentile);
		}
	});
}

//function to take user input and return their sentiment
WhoUB.prototype.analyzeText = function(e) {
	e.preventDefault();
	var inputText = this.inputText.val().trim();
	if (!inputText) { //make sure user typed something
		var settings = { //settings to make a CORS call to NLP
			"async": true,
			"crossDomain": true,
			"url": "https://utcors1.herokuapp.com/https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyAjapmLhqEBFwEd5He9XZXCDP50Ew_GZiU",
			"method": "POST",
			"headers": {
				"content-type": "application/json",
				"cache-control": "no-cache",
				"postman-token": "e21e47e7-3460-0e59-1267-4042c8af2893"
			},
			"processData": false,
			"data": "{\r\n \"document\": {\r\n  \"content\": \"" + inputText + "\",\r\n  \"type\": \"PLAIN_TEXT\"\r\n },\r\n \"encodingType\": \"UTF8\"\r\n}"
		};

		//make ajax call and show results to user

		$.ajax(settings).done(function(response) {
			let newSnip = new this.Snippet(inputText, response.documentSentiment.score,
				response.documentSentiment.magnitude)
			this.curDate.html(newSnip.time);
			this.curText.html(newSnip.text);
			this.curScore.html(newSnip.score);
			this.curMagnitude.html(newSnip.magnitude);
			this.texts.push(newSnip); //put user input into texts array
			//write to firebase
			this.pushToFirebase();
			// let uName = this.userName;
			// let uPic = this.profilePicUrl;
			// let uTexts = this.texts;
			// this.database.ref(this.users + this.uid).set({
			// 	uName,
			// 	uPic,
			// 	uTexts
			// });
			// //empty out input box and show new text in container
			// this.displaySentimentHistory();
			this.inputText.val("");
		}.bind(this));
	}
}

WhoUB.prototype.pushToFirebase = function() {
	//write to firebase
	let uName = this.userName;
	let uPic = this.profilePicUrl;
	let uTexts = this.texts;
	this.database.ref(this.users + this.uid).set({uName, uPic, uTexts});
	this.displaySentimentHistory();
}

$(document).ready(function() {
	var x = new WhoUB();
	x.analyzezPersonality();

	$(document).click(() => {
		x.analyzezPersonality();
	});
});