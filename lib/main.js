var self = require("sdk/self");

var pm = require("sdk/page-mod").PageMod({
  include: 'http://www.forosdelweb.com/*',
  
  contentScriptFile: [
    self.data.url('js/jquery.min.js'),
    self.data.url('js/fdwskin.js'),
    self.data.url("js/cookies.js"),
    self.data.url("js/fdwusability.js")
  ],

  contentStyleFile: [
    self.data.url('css/blackened.css'),
    self.data.url('css/global.css'),
    self.data.url('css/posts.css')
  ]
});