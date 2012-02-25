/*
 *
 * listeners/twitter.js - Event listeners for Hook.io-Twitter.
 *
 * (c) 2011 Nodejitsu Inc.
 *
 */

var TweetSamples = {
		drug_names: ["ritalin", "adderall"],
		positive: ["The only thing that will get this paper written is ####.", " Three cheers for Vitamin R!", "Can't concentrate. Need some ####. Where can I get some?", "Anyone have some ####? I have a long night of essays ahead.",  "#### is better than RedBull at midterms...",  "Can't focus. Need ####. FML.", "I'm going to be up all night studying for sure. I could use some #### right about now.",  "####, the only way to get good marks.",  "####, the intelligence pill.",  "Where can I find some #### to get me through this exam?", "Can anyone spare some ####? Pulling an all-nighter for COMM225.",  "I wrote that exam on #### and got an A.", "####, does the transcript good.",  "Paper due tomorrow!!!!!!! Gonna take some #### to help me out.", "Anyone selling ####? My marks depend on it!!!!!!", "YEAH! I passed math! Thank you ####!", "Two more chapters to go.... Need a boost. Anyone have some ####?", "At least this midterm diet of adderall and coffee will be a great kick off to my Spring Break fast.", "I NEED an adderall prescription #cantfocus.", "'So busy, super stressed.' 'Do you want a Xanax?' 'What I want is something to do all my work for me, can it do that?' 'No that's Adderall.'", "I think i need some ritalin or something jeeze...I hate homework i have to be online for.", "i need ritalin for studying...any contacts?", "Someone gave me some ritalin. Not sure why, I'm already hyper but I took it ####just-in-case#### I need it.", "QBunnz Sittin hea tryna study -_- I need sum ritalin 2help me focus or sumthing.", "I need adderall or ritalin or anything to keep me focused this week #shortestattentionspan.", "If I could focus for longer that .03 seconds this assignment would be done and I could be reading my book. I think I need ritalin.", "a nigga might need Ritalin cuz i been trying to do my homework since like 4 and aint wrote shit.", "Nevermind. I need some ritalin if I'm gonna do this. #collegekidproblems.", "I seriously think I need some Adderal or Ritalin or something. This short term memory & no attn span is REALLY getting on my nerves.", "Sounds like you need ritalin my friend ;) RT.", "@TanianLola: When i have 2 study, even the walls in my bedroom looks more interesting.", "I seriously can't concentrate omfg I need ritalin I swear.", "Wonder if I should start taking Ritalin for my ADHD. I just really need improved attention to whatever I'm doing. :( "],
		negative: ["Parents should not be pumping their kids full of #### to control them.", "#### is not a babysitter.", "Out of my ####. Need a refill on my prescription.", "I have ADD and I take ####.", "I have ADHD and I take ####.", "My ADD is out of control. Time for another dose of ####.", "I think I have ADHD. Maybe I need ####.", "I have a prescription for ####.", "It's so hard to get my prescription for #### filled these days.", "The pharmacist told me I can't get my ####. WTF?", "These kids I'm babysitting are sooooooo hyper. #### anyone?", "The Art of Distraction", "I can't stop watching Rob Dyrdek's #FantasyFactory. He's like Willy Wonka for the Ritalin generation.", "'Difference between a blackberry owner and a ritalin user? The ritalin user at least tries to atone for his attention deficit.' Friend on FB.", "'My name is Jalen, and I am a Super Saiyan' please child, sit all the way back down, and get some Ritalin too.", "College hoes love alcohol.. & poppin Adderall.", "They need to make Ritalin for dogs.", "Oh Sweet Mother Of God!!!! These 5th Graders Need Some Ritalin, Like Now!!!", "I'm gonna need to re-up on my ritalin subscription before I go back to college.", "I REALLY JUST NEED TO START BACK SMOKIN LIKE I USED; WEED FOR ME IS LIKE RITALIN FOR THEM HYPER KIDS, IT BALANCES ME OUT...", "I've been very talkative today. Need. more. Ritalin. ....ahhh, I'm just busting your balls. ...Or am I??? Lol,", "YES YES, GOT THE JOB MAKING REASONABLE PAY AND HELLA GOOD HOURS, I'MA NEED SOME RITLIN (RITALIN) THOUGH.", "Your child does not need ritalin for adhd @5 it needs fruit in the am instead of a soda chocolate bar & bag of chips #try changing that 1st."]
};

function trainEngine(theEngine) {
	for(var drugNameIdx in TweetSamples.drug_names) {
			var drugName = TweetSamples.drug_names[drugNameIdx];
			console.log("TRAINING FOR DRUG NAMED: " + drugName);
			
			for(var positiveIdx in TweetSamples.positive) {
				var cleanString = TweetSamples.positive[positiveIdx];
				cleanString = cleanString.replace("####", drugName);

				theEngine.addDocument(cleanString, "1");
				console.log("POSITIVE ADDED: " + cleanString);
			}

			for(var negativeIdx in TweetSamples.negative) {
				var cleanString = TweetSamples.negative[negativeIdx];
				cleanString = cleanString.replace("####", drugName);

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
	if(data.search(/http:/i)) {
		console.log("tweet with link in it, ignoring it since it's probably spam");
	}
	
	if(parseInt(classifier.classify(data))) {
		console.log("Positive identification of tweet: " + data);
	}
  });

  self.on('*::reported', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have reported ' + data.name + ' as a spammer.'});
  });

  self.on('*::blocked', function (data) {
    self.emit('sendMsg', {dest: data.to, msg: 'I have blocked ' + data.name + '.'});
  });
};
