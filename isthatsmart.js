var http = require('http');

var natural = require('natural'),  
classifier = new natural.BayesClassifier();  
classifier.addDocument("i say meow", 'cat');  
classifier.addDocument("I speak english", 'person');  
classifier.addDocument("People speak english", 'cat');  
classifier.addDocument("Cats say meow", 'person');  
classifier.train();

var TweetClassifier = function () {}

var TweetSamples = {
	drug_names: ["ritalin", adderall]
	positive: ["I need my ritalin", "I can't focus, need ritalin"],
	negative: ["Ritalin is funny", "My kid is on ritalin because he has ADHD"]
}

TweetClassifier.prototype.init = function() {
	this.engine = new natural.BayesClassifier();
	for(var drugNameIdx in TweetSamples.drug_names) {
		var drugName = TweetSamples.drug_names[drugNameIdx];
		
		for(var positiveIdx in TweetSamples.positive) {
			var cleanString = TweetSamples.positive[positiveIdx];
			cleanString.replace("###", drugName);
			
			this.engine.addDocument(cleanString, "1");
		}
	
		for(var negativeIdx in TweetSamples.negative) {
			var cleanString = TweetSamples.negative[negativeIdx];
			cleanString.replace("###", drugName);
			
			this.engine.addDocument(cleanString, "0");
		}	
	}
}

TweetClassifier.prototype.classify = function(tweetData) {
	var retVal = false;
	
	if(parseInt(this.engine.classify(tweetData))) {
		retVal = true;
	}
	
	return retVal;
}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(classifier.classify('meow'));
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');