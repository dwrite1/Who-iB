var tempOutput;
function WhoUB(){
	//get DOM elements
	this.sendText = document.getElementById('send-text');
	this.signInButton = document.getElementById('login-button');
	this.signOutButton = document.getElementById('sign-out');	
	this.inputText = $('#input-text');
	this.loginDiv = $('#logged-out-stuff');
	this.profileDiv = $('#logged-in-stuff');
	this.displayTone = $('#tone-information');
	this.userWelcome = $('#user-welcome');

	//add event listeners to DOM elements and bind them to the object's namespace
	this.signInButton.addEventListener('click', this.signIn.bind(this));
	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.sendText.addEventListener('click', this.analyzeText.bind(this));
	this.displaySentimentHistory.bind(this);

	this.Snippet = function(text, score = 0, magnitude = 0){		//Object to hold individual user inputs
		this.text = text;
		this.time = new Date().toLocaleString('en-US')
		this.score = score;
		this.magnitude = magnitude;
	}
	this.texts = [];						//holds all user input
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
	this.users = 'users/';					//location of all users
	this.snippets = 'snippets/';			//location of all analyzed text
	this.loginDiv.hide();
	this.profileDiv.hide();

	//called when someone logs in or out
	this.onAuthStateChanged = function(user) {
	  if (user) { 									// User is signed in!
	  	this.loginDiv.hide();						// hide login button
	  	this.profileDiv.show();	
	    this.uid = user.uid; 						// get user info from google auth
	    this.profilePicUrl = user.photoURL;  
	    this.userName = user.displayName;

	  	//look for the user based on UID
	    this.database.ref(this.users+this.uid).once('value')
	    	.then(function(snapshot) {
		    if(snapshot.val()==null){				//User not in DB so add them
		    	console.log("account doesn't exist");
	    		//write to firebase
				let uName = this.userName;			//new vars b/c set doesn't like dots
				let uPic = this.profilePicUrl;
				let uTexts = this.texts;
				this.database.ref(this.users+this.uid).set({uName, uPic, uTexts});
			//write user info into firebase
		    // this.database.ref(this.users+this.uid).set({this.userName, this.profilePicUrl, this.texts});
			} else {								//user exists, get their info    		
			    console.log(snapshot.val().uName + " is in our Database");
	    		if(snapshot.val().uTexts!= undefined){
			    	this.texts = snapshot.val().uTexts;
			    	this.displaySentimentHistory();
			    }
			    this.userWelcome.html(this.userName);
			}
	    }.bind(this));
// //overrite firbase info
// this.database.ref(this.users+uid).set({userName, profilePicUrl, text});
	    }else{
	    	console.log("logged out");
	    	this.profileDiv.hide();
	    	this.loginDiv.show();
	    }
	}
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));	//send any auth changes to Google's obj
	
}
	//show historical sentiments in the sentiment div
	WhoUB.prototype.displaySentimentHistory = function(){
		$('#sentiments-eq').html("");
		let sentimentContainer, calloutClass, curSentiment;
		for(key in this.texts){
		console.log(this.texts[key].score);
			sentimentContainer = $('<div class="medium-3 cell">');
			calloutClass = "secondary";
			if(this.texts[key].score >.6 && this.texts[key].magnitude > 1){
				calloutClass = "success";
			}else if(this.texts[key].score < -0.6 && this.texts[key].magnitude > 1){
				calloutClass = "alert";
			}
			curSentiment = sentimentContainer.html($('<div class="callout" data-equalizer-watch>')
				.addClass(calloutClass).html(this.texts[key].text+this.texts[key].time+this.texts[key].score));
			$('#sentiments-eq').append(curSentiment);
		}
	}
  //GoogApp method to allow users to sign in
  WhoUB.prototype.signIn = function(e){
  		e.preventDefault();
		var provider = new firebase.auth.GoogleAuthProvider();
		this.auth.signInWithPopup(provider);    		
  }

  //GoogApp method to allow users to sign out  
  WhoUB.prototype.signOut = function(e){
  	e.preventDefault();
  	this.auth.signOut();
  	console.log("signed out");
  }

//function to take user input and return their sentiment
WhoUB.prototype.analyzeText = function(){
	var inputText = this.inputText.val().trim();
	if (inputText != "") {									//make sure user typed something
		var settings = {									//settings to make a CORS call to NLP
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
		  "data": "{\r\n \"document\": {\r\n  \"content\": \"" + inputText +"\",\r\n  \"type\": \"PLAIN_TEXT\"\r\n },\r\n \"encodingType\": \"UTF8\"\r\n}"
		}

		//make ajax call and show results to user
		$.ajax(settings).done(function (response) {
				var output = $('<ul>').html($('<li>').html("Sentiment Score: " + 
				response.documentSentiment.score)).append("Sentiment Magnitude: " + 
				response.documentSentiment.magnitude);
				this.displayTone.html(output);
		this.texts.push(new this.Snippet(inputText, 				//put user input into texts array
			response.documentSentiment.score, response.documentSentiment.magnitude));
		//write to firebase
		let uName = this.userName;
		let uPic = this.profilePicUrl;
		let uTexts = this.texts;
		this.database.ref(this.users+this.uid).set({uName, uPic, uTexts});

		  console.log(response.documentSentiment.magnitude);
		  console.log(response.documentSentiment.score);
		}.bind(this));	

	}

}

$(document).ready(function(){

	var x = new WhoUB();	
});
