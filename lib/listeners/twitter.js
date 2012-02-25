/*
 *
 * listeners/twitter.js - Event listeners for Hook.io-Twitter.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var TweetSamples = {
	drug_names: ["ritalin", "adderall"],
	positive: ["I need my ritalin", 
			   "I can't focus, need ritalin"],
	negative: ["Ritalin is funny", 
	           "My kid is on ritalin because he has ADHD"]
}

function trainEngine(theEngine) {
	for(var drugNameIdx in TweetSamples.drug_names) {
			var drugName = TweetSamples.drug_names[drugNameIdx];
			console.log("TRAINING FOR DRUG NAMED: " + drugName);
			
			for(var positiveIdx in TweetSamples.positive) {
				var cleanString = TweetSamples.positive[positiveIdx];
				cleanString.replace("###", drugName);

				theEngine.addDocument(cleanString, "1");
				console.log("POSITIVE ADDED: " + cleanString);
			}

			for(var negativeIdx in TweetSamples.negative) {
				var cleanString = TweetSamples.negative[negativeIdx];
				cleanString.replace("###", drugName);

				theEngine.addDocument(cleanString, "0");
				console.log("NEGATIVE ADDED: " + cleanString);
			}	
	}
	
	theEngine.train();
}


var twitter = module.exports = function () {
  var self = this;
  var natural = require('natural');
  var classifier = new natural.BayesClassifier();

  console.log("initialized twitter module");
  trainEngine(classifier)

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
