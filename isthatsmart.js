var TweetSamples = {
	drug_names: ["ritalin", "adderall"],
	positive: ["I need my ritalin", 
			   "I can't focus, need ritalin"],
	negative: ["Ritalin is funny", 
	           "My kid is on ritalin because he has ADHD"]
}

var natural = require('natural');

var TweetClassifier = exports.Kohai = functions(options) {
	for (var o in options) {
	    this[o] = options[o];
	  }	
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

