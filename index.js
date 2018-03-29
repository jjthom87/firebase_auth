//https://firebase.google.com/docs/auth/web/start
$(document).ready(function(){	
	var config = {
		apiKey: "AIzaSyCM319jPQ_dH0fh3pnKtWrZJgSdZZSkaQc",
		authDomain: "my-cool-demo-app-ea0c4.firebaseapp.com",
		databaseURL: "https://my-cool-demo-app-ea0c4.firebaseio.com",
		projectId: "my-cool-demo-app-ea0c4",
		storageBucket: "my-cool-demo-app-ea0c4.appspot.com",
		messagingSenderId: "48728940261"
	};
	firebase.initializeApp(config);

	var firebaseRef = firebase.database().ref();
	//var users = firebase.database().ref("Users");

	$('#logout_button').hide();

	$('#sign_up_form').on('submit', function(e){
		e.preventDefault();
		var email = $('#email_su_input').val();
		var password = $('#password_su_input').val();
		firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
			firebaseRef.child("Users").child(user.uid).set({email: email, zip_code: $('#zip_su_input').val()})
			$('#email_su_input').val("");
			$('#zip_su_input').val("")
			$('#password_su_input').val("");
		}).catch(function(error) {
			if(error){
				throw new Error(error.code + " : " + error.message);
			}
		});
	});

	$('#sign_in_form').on('submit', function(e){
		e.preventDefault();
		var email = $('#email_si_input').val();
		var password = $('#password_si_input').val();
		firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
			$('#email_si_input').val("");
			$('#password_si_input').val("");
		}).catch(function(error) {
			if(error){
				throw new Error(error.code + " : " + error.message);
			}
		});
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("User Signed In");
			//console.log(user)

			firebaseRef.on("value", function(snapshot) {
				//console.log(snapshot.val())
				var users = snapshot.val().Users;
				for(var i in users){
					if(users[i].email == user.email){
						console.log(users[i])
						//here is where youre information will be displayed
						//in the html regarding the users
					}
				}
				//console.log(Object.keys(snapshot.val().Users).length)
			}, function(errorObject){
				console.log("Errors handled: " + errorObject.code)
			})

			$('#logout_button').show();
			$('#logout_button').on('click', function(){
				firebase.auth().signOut().then(function() {
					console.log("Signout Successful");
					$('#logout_button').hide();
				}, function(error) {
					throw new Error("Error: " + error);
				});
			})
		    // var displayName = user.displayName;
		    // var email = user.email;
		    // var emailVerified = user.emailVerified;
		    // var photoURL = user.photoURL;
		    // var isAnonymous = user.isAnonymous;
		    // var uid = user.uid;
		    // var providerData = user.providerData;
	    } else {
	    	console.log("No User Signed In")
	    }
	});

});
