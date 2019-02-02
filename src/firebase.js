import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
//   import 'firbase/database'
  require('firebase/database');


// Initialize Firebase
var config = {
    apiKey: "AIzaSyAVyjmLFNn8enHcF1nJVdPvkXbusRpAQag",
    authDomain: "react-slack-5d9e2.firebaseapp.com",
    databaseURL: "https://react-slack-5d9e2.firebaseio.com",
    projectId: "react-slack-5d9e2",
    storageBucket: "react-slack-5d9e2.appspot.com",
    messagingSenderId: "784251827216"
};


firebase.initializeApp(config);

export default firebase;