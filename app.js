var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");

global.username = ":";
global.password = "";

app.get("/", function(req, res) {
  request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5EORassignment_group%3D6c54c1a06f1ca100ab448bec5d3ee4f2%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
          function(error, response, body){
            if(error) {
              console.log("error");
            }
            resp = {};
            resp.lms = JSON.parse(body).result;
            request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
                      function(error, response, body){
                        if(error) {
                          console.log("error");
                        }
                      resp.multimedia = JSON.parse(body).result;
                      request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
                                function(error, response, body){
                                  if(error) {
                                    console.log("error");
                                  }
                                resp.pollev = JSON.parse(body).result;
                                res.render("home", {body:resp});
                      });
            });
  });
});


io.on('connection', function(socket){
  socket.on('pingticket', function(data){
    request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5EORassignment_group%3D6c54c1a06f1ca100ab448bec5d3ee4f2%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
            function(error, response, body){
              if(error) {
                console.log("error");
              }
              resp = {};
              resp.lms = JSON.parse(body).result;
              request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
                        function(error, response, body){
                          if(error) {
                            console.log("error");
                          }
                        resp.multimedia = JSON.parse(body).result;
                        request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5Esys_class_name%3Du_simple_requests%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cdescription&sysparm_limit=100',
                                  function(error, response, body){
                                    if(error) {
                                      console.log("error");
                                    }
                                  resp.pollev = JSON.parse(body).result;
                                  io.emit('ticketRefresh', resp);
                        });
              });
    });
  });
});


http.listen(3000, function(){
  console.log("dashboard started");
});
