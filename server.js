var express = require("express");
var app = express.createServer();

var SESSION;
var $ = {};

app.configure(function() {
  app.use(express.static(__dirname+'/assets'));
  app.set('views', __dirname + '/views');
  
  app.set('view engine', 'ejs');
  app.set("view options", {layout: false});
  
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "tgae54yw46r"  }));
  
  //app.use(app.router);
});

 
app.listen(8082);

app.get('/', function(req, res){
  res.render('index', {
    
  });
});

var UUIDv4 = function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

var isMobile = function(req) {
  var ua = req.headers['user-agent'];
    
  $.Mobile = false;
  if (/mobile/i.test(ua))
    $.Mobile = true;
      
  return $.Mobile;
}