const PERSONALITY_GRID = {
	"Openness" : {
		"Adventurousness" : 
			["You enjoy familiar routines and prefer not to deviate from them.", "You are eager to experience new things."],
		"Artistic interests" : 
			["You are less concerned with artistic or creative activities than most people.", "You enjoy beauty and seek out creative experiences."],
		"Emotionality" : 
			["You do not frequently think about or openly express your emotions.", "You are aware of your feelings and how to express them."],
		"Imagination" : 
			["You prefer facts over fantasy.", "You have a wild imagination."],
		"Intellect" : 
			["You prefer dealing with the world as it is, rarely considering abstract ideas.", "You are open to and intrigued by new ideas and love to explore them."],
		"Authority-challenging" : 
			["You prefer following with tradition to maintain a sense of stability.", "You prefer to challenge authority and traditional values to effect change."]
		},
	"Emotional range" : {
		"Fiery" : 
			["It takes a lot to get you angry.", "You have a fiery temper, especially when things do not go your way."],
		"Prone to worry" : 
			["You tend to feel calm and self-assured.", "You tend to worry about things that might happen."],
		"Melancholy" : 
			["You are generally comfortable with yourself as you are.", "You think quite often about the things you are unhappy about."],
		"Immoderation" : 
			["You have control over your desires, which are not particularly intense.", "You feel your desires strongly and are easily tempted by them."],
		"Self-consciousness" : 
			["You are hard to embarrass and are self-confident most of the time.", "You are sensitive about what others might be thinking of you."],
		"Susceptible to stress" : 
			["You handle unexpected events calmly and effectively.", "You are easily overwhelmed in stressful situations"]
		},
	"Extraversion" : {
		"Activity level" : 
			["You appreciate a relaxed pace in life.", "You enjoy a fast-paced, busy schedule with many activities."],
		"Assertiveness" : 
			["You prefer to listen than to talk, especially in group situations.", "You tend to speak up and take charge of situations, and you are comfortable leading groups."],
		"Cheerfulness" : 
			["You are generally serious and do not joke much.", "You are a joyful person and share that joy with the world."],
		"Excitement-seeking" : 
			["You prefer activities that are quiet, calm, and safe.", "You are excited by taking risks and feel bored without lots of action going on."],
		"Outgoing" : 
			["You are a private person and do not let many people in.", "You make friends easily and feel comfortable around other people."],
		"Gregariousness" : 
			["You have a strong desire to have time to yourself.", "You enjoy being in the company of others."]
		},
	"Conscientiousness" : {
		"Achievement striving" : 
			["You are content with your level of accomplishment and do not feel the need to set ambitious goals.", "You set high goals for yourself and work hard to achieve them."],
		"Cautiousness" : 
			["You would rather take action immediately than spend time deliberating making a decision.", "You carefully think through decisions before making them."],
		"Dutifulness" : 
			["You do what you want, disregarding rules and obligations.", "You take rules and obligations seriously, even when they are inconvenient."],
		"Orderliness" : 
			["You do not make a lot of time for organization in your daily life.", "You feel a strong need for structure in your life."],
		"Self-discipline" : 
			["You have a hard time sticking with difficult tasks for a long period of time.", "You can tackle and stick with tough tasks."],
		"Self-efficacy" : 
			["You frequently doubt your ability to achieve your goals.", "You feel you have the ability to succeed in the tasks you set out to do."]
		},
	"Agreeableness" : {
		"Altruism" : 
			["You are more concerned with taking care of yourself than taking time for others.", "You feel fulfilled when helping others and will go out of your way to do so."],
		"Cooperation" : 
			["You do not shy away from contradicting others.", "You are easy to please and try to avoid confrontation."],
		"Modesty" : 
			["You hold yourself in high regard and are satisfied with who you are.", "You are uncomfortable being the center of attention."],
		"Uncompromising" : 
			["You are comfortable using every trick in the book to get what you want.", "You think it is wrong to take advantage of others to get ahead."],
		"Sympathy" : 
			["You think people should generally rely more on themselves than on others.", "You feel what others feel and are compassionate toward them."],
		"Trust" : 
			["You are wary of other people's intentions and do not trust easily.", "You believe the best in others and trust people easily."]
		},
};
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
	this.profileImage =  $('#profile-image');
	this.profileName = $('#profile-username');
	this.profileTrait = $('#profile-trait');
	this.profileText = $('#profile-text');
	this.userNeeds = $('#user-needs');
	this.userValues = $('#user-values');
	this.wordModal = $('#wordWarningModal');
	this.wordWarning = $('#wordWarningAlert');

	//add event listeners to DOM elements and bind them to the object's namespace
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.sendText.addEventListener('click', this.analyzeText.bind(this));
	this.modalClose.addEventListener('click', this.closeModal.bind(this));
	this.modalDelete.addEventListener('click', this.deleteSentiment.bind(this));

	$('.card-info').on('click', function(item) {
		console.log(item);
	});
	this.displaySentimentHistory.bind(this);
	this.pushToFirebase.bind(this);
	this.Snippet = function(text, score = 0, magnitude = 0) { //Object to hold individual user inputs
		this.text = text;
		this.time = new Date().toLocaleString('en-US')
		this.score = score;
		this.magnitude = magnitude;
	}
	this.texts = []; 				//holds all user texts
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
	$(this.signOutButton).hide();
	this.wordWarning.hide();
	this.profileDiv.hide();

	//called when someone logs in or out
	this.onAuthStateChanged = function(user) {
		if (user) { 				// User is signed in!
			this.loginDiv.hide(); 	// hide login button
			this.profileDiv.show(); $(this.signOutButton).show();
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
						//write user info into firebase
					} else { //user exists, get their info    		
						console.log(snapshot.val().uName + " is in our Database");
						if (snapshot.val().uTexts != undefined) {
							this.texts = snapshot.val().uTexts;
							this.displaySentimentHistory();
						}
						this.userWelcome.html(this.userName);
						this.profileName.html(this.userName);
						this.profileImage.attr("src", this.profilePicUrl);	
						this.analyzezPersonality();				
					}
				}.bind(this));
		} else { //user logged out - hide profile info and show login
			console.log("logged out");
			this.profileDiv.hide(); $(this.signOutButton).hide();
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
	var minimumLength = 600;
	if (combinedText.length < minimumLength) {
		this.wordWarning.show();
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
		//Show big 5 personality in Graphs
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

		//Show 5 Values
		var loop = 5;
		if (res.values.length < loop){
			loop = res.values.length;
		}
		this.userValues.html("");
		for (var i = 0; i < loop; i++) {
			this.userValues.append($("<li>").html(res.values[i].name).append(" - " + 
				Math.floor(res.values[i].percentile*100) + "%"));
		}

		//Show 5 Needs
		loop = 5;
		this.userNeeds.html("");
		if (res.needs.length < loop){
			loop = res.needs.length;
		}
		for (var i = 0; i < loop; i++) {
			this.userNeeds.append($("<li>").html(res.needs[i].name).append(" - " + 
				Math.floor(res.values[i].percentile*100) + "%"));
		}

		//Display peronality Bio
		let aPersonality, aFacet, bio="", curFacet;
		for(personalityIndex in res.personality) {
			aPersonality = res.personality[personalityIndex].name;
			for(facetIndex in (facet = res.personality[personalityIndex].children)){
				curFacet = facet[facetIndex].name;
				if(facet[facetIndex].percentile > .5){
					if (facet[facetIndex].raw_score > .5) {
						bio += PERSONALITY_GRID[aPersonality][facet[facetIndex].name][1] + " ";
					}else {
						bio += PERSONALITY_GRID[aPersonality][facet[facetIndex].name][0] + " ";
					}
				}
			}
			bio += "<br>";
		}
		this.profileText.html(bio);
	});
}

//function to take user input and return their sentiment
WhoUB.prototype.analyzeText = function(e) {
	e.preventDefault();
	var inputText = this.inputText.val().trim();
	if (inputText != "") { //make sure user typed something
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
			this.inputText.val("");
			this.analyzezPersonality();
		}.bind(this));
	}else{
			this.wordModal.foundation('open');
	}
}

WhoUB.prototype.pushToFirebase = function() {
	//write to firebase
	let uName = this.userName;
	let uPic = this.profilePicUrl;
	let uTexts = this.texts;
	this.database.ref(this.users + this.uid).set({uName, uPic, uTexts});
	this.displaySentimentHistory();
	this.analyzezPersonality();
}

$(document).ready(function() {
	var x = new WhoUB();

	$('#profile-image').click(() => {
		x.analyzezPersonality();
	});
});


