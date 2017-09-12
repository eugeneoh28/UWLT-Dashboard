var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");

global.username = "";
global.password = "";

app.get("/", function(req, res) {
  request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Estate%3D2%5EORstate%3D1%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5Esys_class_name%3Du_simple_requests&sysparm_display_value=true&sysparm_fields=state%2Cnumber&sysparm_limit=10',
          function(error, response, body){
            if(error) {
              console.log("error");
            }
            resp = {};
            resp.lms = JSON.parse(body).result;
            resp.ticketnum = resp.lms.length;
            request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=assignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5EORassignment_group%3Dbfb292e26f26110054aafd16ad3ee4e4%5Estate%3D1%5EORstate%3D2&sysparm_fields=state%2Cnumber%2Csys_updated_on%2Ccmdb_ci&sysparm_limit=10',
                      function(error, response, body){
                        if(error) {
                          console.log("error");
                        }
                      resp.multimedia = JSON.parse(body).result;
                      resp.ticketnum += resp.multimedia.length;
                      res.render("home", {body:resp});
            });
  });
});


io.on('connection', function(socket){
  socket.on('pingticket', function(data){
    request('http://'+username + password +'@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Estate%3D2%5EORstate%3D1%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5Esys_class_name%3Du_simple_requests&sysparm_display_value=true&sysparm_fields=state%2Cnumber&sysparm_limit=10',
            function(error, response, body){
              if(error) {
                console.log("error");
              }
              var parsedBody = JSON.parse(body);
              io.emit('ticketRefresh', parsedBody.result);
            });
  })
})


http.listen(3000, function(){
  console.log("dashboard started");
});
