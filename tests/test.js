$(document).ready(() => {
    //GAuth Web client id: 258703035332-75citlmv9as7ifscqmqjf0j9ki077drm.apps.googleusercontent.com
    //client secret: iN1H2q9OKwolPF7u_iDa8iwN

    //firebase initialization
    function GoogApp() {
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
        this.users = 'users/'; //location of all users

        //get DOM elements
        this.signInButton = document.getElementById('sign-in');
        this.signOutButton = document.getElementById('sign-out');

        //add event listeners to DOM elements and bind them to the object's namespace
        this.signInButton.addEventListener('click', this.signIn.bind(this));
        this.signOutButton.addEventListener('click', this.signOut.bind(this));

        //called when someone loggs in or ot
        this.onAuthStateChanged = function(user) {
            if (user) { // User is signed in!
                var uid = user.uid; // get user info from google auth
                var profilePicUrl = user.photoURL;
                var userName = user.displayName;
                text = {
                    text1: "heres some text",
                    text2: "heres more text"
                };
                var userFolder = this.users + uid; //get the folder for each user

                //look for the user based on UID
                this.database.ref(this.users + uid).once('value')
                    .then(function(snapshot) {
                        if (snapshot.val() == null) { //User not in DB so add them
                            console.log("account doesn't exist");
                        } else { //user exists, get their info    		
                            console.log(snapshot.val().userName + " is in out Database");
                        }
                    });
                //overrite firbase info
                this.database.ref(this.users + uid).set({
                    userName,
                    profilePicUrl,
                    text
                });
            }
        }
        this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this)); //Not sure what this line is about
    }
    //GoogApp method to allow users to sign in
    GoogApp.prototype.signIn = function(e) {
        e.preventDefault();
        var provider = new firebase.auth.GoogleAuthProvider();
        this.auth.signInWithPopup(provider);
    }

    //GoogApp method to allow users to sign out  
    GoogApp.prototype.signOut = function(e) {
        e.preventDefault();
        this.auth.signOut();
        console.log("signed out");
    }

    $(document).ready(function() {
        var y = new GoogApp(); //Create an opject of the code to start
    });
});