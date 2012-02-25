var http = require('http');

var natural = require('natural'),  
classifier = new natural.BayesClassifier();  
classifier.addDocument("i say meow", 'cat');  
classifier.addDocument("I speak english", 'person');  
classifier.addDocument("People speak english", 'cat');  
classifier.addDocument("Cats say meow", 'person');  
classifier.train();

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(classifier.classify('meow'));
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');