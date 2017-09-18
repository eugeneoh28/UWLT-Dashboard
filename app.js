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
global.lms = '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5EORassignment_group%3D6c54c1a06f1ca100ab448bec5d3ee4f2%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100';
global.multimedia = '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5EORassignment_group%3Dbfb292e26f26110054aafd16ad3ee4e4%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100';
global.pollev = '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D6bbb84d16ff5650090ead2054b3ee414%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100'
global.name = ['Canvas and Catalyst Requests', 'Multimedia Requests', 'Poll Everywhere Tickets']

app.get("/", function(req, res) {
  request('http://' + username + password + lms,
          function(error, response, body){
            if(error) {
              console.log("error");
            }
            resp = [];
            oldest = {};
            oldLongest = 0;
            today = new Date();
            temp = JSON.parse(body).result;
            longest = 0;
            resp[0] = {};
            resp[0].count = temp.length;
            resp[0].name = name[0];
            JSON.parse(body).result.forEach(function(req){
              diff = Math.abs(today - new Date(req.sys_updated_on));
              if (diff > longest) {
                resp[0].oldest = req;
                longest = diff;
              }
              if (diff > oldLongest) {
                oldest = req;
                oldLongest = diff;
              }
            })
            request('http://' + username + password + multimedia,
                      function(error, response, body){
                        if(error) {
                          console.log("error");
                        }
                        temp = JSON.parse(body).result;
                        longest = 0;
                        resp[1] = {};
                        resp[1].count = temp.length;
                        resp[1].name = name[1];
                        temp.forEach(function(req){
                          diff = Math.abs(today - new Date(req.sys_updated_on));
                          if (diff > longest) {
                            resp[1].oldest = req;
                            longest = diff
                          }
                          if (diff > oldLongest) {
                            oldest = req;
                            oldLongest = diff;
                          }
                        })
                      request('http://' + username + password + pollev,
                                function(error, response, body){
                                  if(error) {
                                    console.log("error");
                                  }
                                  temp = JSON.parse(body).result;
                                  longest = 0;
                                  resp[2] = {};
                                  resp[2].count = temp.length;
                                  resp[2].name = name[2];
                                  temp.forEach(function(req) {
                                    diff = Math.abs(today - new Date(req.sys_updated_on));
                                    if (diff > longest) {
                                      resp[2].oldest = req;
                                      longest = diff
                                    }
                                    if (diff > oldLongest) {
                                      oldest = req;
                                      oldLongest = diff;
                                    }
                                  })
                                res.render("home", {body:resp, oldest:oldest});
                      });
            });
  });
});


io.on('connection', function(socket){
  socket.on('pingticket', function(data){
    request('http://' + username + password + '@uw.service-now.com/api/now/table/task?sysparm_query=assignment_group%3D6bbb84d16ff5650090ead2054b3ee414%5Estate%3D1%5EORstate%3D2%5Esys_class_name%3Du_simple_requests&sysparm_fields=number%2Cstate%2Cdescription%2Csys_updated_on&sysparm_limit=100',
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
