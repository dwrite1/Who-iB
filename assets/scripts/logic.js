var tempOutput;
function WhoUB(){
	//get DOM elements
	this.sendText = document.getElementById('send-text');
	this.inputText = $('#input-text');
	this.loginDiv = $('#logged-out-stuff');
	this.profileDiv = $('#logged-in-stuff');
	this.signInButton = document.getElementById('login-button');
	this.signOutButton = document.getElementById('sign-out');	//TODO
	this.displayTone = $('#tone-information');

	//add event listeners to DOM elements and bind them to the object's namespace
	this.signInButton.addEventListener('click', this.signIn.bind(this));
//	this.signOutButton.addEventListener('click', this.signOut.bind(this));

	this.sendText.addEventListener('click', this.analyzeText.bind(this));

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
	this.loginDiv.hide();
	this.profileDiv.hide();

	//called when someone logs in or out
	this.onAuthStateChanged = function(user) {
	  if (user) { 							// User is signed in!
	  	this.loginDiv.hide();					// hide login button
	  	this.profileDiv.show();
	    var uid = user.uid; 				// get user info from google auth
	    var profilePicUrl = user.photoURL;  
	    var userName = user.displayName;
	    text = {text1:"heres some text", text2:"heres more text"};
	  	var userFolder = this.users+uid;	//get the folder for each user

	  	//look for the user based on UID
	    this.database.ref(this.users+uid).once('value')
	    	.then(function(snapshot) {
		    if(snapshot.val()==null){		//User not in DB so add them
		    	console.log("account doesn't exist");
			} else {						//user exists, get their info    		
			    console.log(snapshot.val().userName + " is in our Database");
			}
	    });
		//overrite firbase info
	    this.database.ref(this.users+uid).set({userName, profilePicUrl, text});
	    }else{
	    	this.profileDiv.hide();
	    	this.loginDiv.show();
	    }
	}
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));	//Not sure what this line is about
	
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
			var output = $('<ul>').html($('<li>').html("Sentiment Score: " + 
			response.documentSentiment.score)).append("Sentiment Magnitude: " + 
			response.documentSentiment.magnitude);
		$('#tone-information').html(output);
	  console.log(response.documentSentiment.magnitude);
	  console.log(response.documentSentiment.score);

	});	

	}

}

$(document).ready(function(){

	var x = new WhoUB();	
});
