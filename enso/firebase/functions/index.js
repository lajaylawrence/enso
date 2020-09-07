const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

// AUTH TRIGGERS
// auth function: reacts to an authentication change --------------------------------------------

exports.newUserSignup = functions.auth.user().onCreate((user) => {
  console.log("user created", user.email, user.uid); // this logs it the the logs section in functions not the website
  // creating a record for the user once they register
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    username: user.email,
  });
});

// when a user is deleted
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted", user.email, user.uid);
  // deleting a record for the user once they register
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});
