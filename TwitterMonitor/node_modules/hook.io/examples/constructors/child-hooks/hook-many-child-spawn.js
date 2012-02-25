
var Hook = require('hook.io').Hook;

var hook = new Hook({ 
  name: "hook",
  hooks: ["helloworld", "helloworld", "helloworld", "helloworld"]
});

hook.on('hook::ready', function(){
  console.log('hook ready');
});

hook.start();