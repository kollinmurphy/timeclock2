import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB3-fE-D-hO3fVdat1G-6vjChqrK-dD094",
  authDomain: "timeclock-c36a4.firebaseapp.com",
  projectId: "timeclock-c36a4",
  storageBucket: "timeclock-c36a4.appspot.com",
  messagingSenderId: "1080175131085",
  appId: "1:1080175131085:web:cc24882ed4ffbcdc0cec84",
  measurementId: "G-B7LKW87DQT",
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
