/*
 *
 * listeners/twitter.js - Event listeners for Hook.io-Twitter.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var twitter = module.exports = function () {
  var self = this;
  var natural = require('natural');
  var classifier = new natural.BayesClassifier();

  console.log("initialized twitter module");
  classifier.addDocument("my unit-tests failed.", 'software');  
  classifier.addDocument("tried the program, but it was buggy.", 'software');  
  classifier.addDocument("the drive has a 2TB capacity.", 'hardware');  
  classifier.addDocument("i need a new power supply.", 'hardware');  
  classifier.train();

  self.on('*::keptTweet', function (data) {	
    console.log(data);
    console.log("---");
    console.log(classifier.classify('did the tests pass?'));  
  });

  self.on('*::reported', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  self.on('*::blocked', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });
};
