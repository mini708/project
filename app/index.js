var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var routes = require('./config/routes.js');

var config = {
	    apiKey: "AIzaSyA7QaWgN3hB0cL7u08gsUptWA6LcxZHspE",
    	authDomain: "users-4ab7c.firebaseapp.com",
    	databaseURL: "https://users-4ab7c.firebaseio.com",
    	storageBucket: "users-4ab7c.appspot.com",
    	messagingSenderId: "300695220008"
	};

firebase.initializeApp(config);
ReactDOM.render(routes, document.getElementById('app'));
