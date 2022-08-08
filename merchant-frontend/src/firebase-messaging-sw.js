// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyCT2uJ65RF0kMCJAJq7KbVdwaxpx8JMReQ",
  authDomain: "taager-f1342.firebaseapp.com",
  databaseURL: "https://taager-f1342-default-rtdb.firebaseio.com",
  projectId: "taager-f1342",
  storageBucket: "taager-f1342.appspot.com",
  messagingSenderId: "304390550395",
  appId: "1:304390550395:web:1dc08e43a00dde1adf03de",
  measurementId: "G-HG4B7LM213"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


