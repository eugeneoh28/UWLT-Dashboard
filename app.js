var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    request = require("request");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  request('http://'+':'+''+'@uwtest.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Estate%3D2%5EORstate%3D1%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5Esys_class_name%3Du_simple_requests&sysparm_display_value=true&sysparm_fields=state%2Cnumber&sysparm_limit=10',
          function(error, response, body){
            if(error) {
              console.log("error");
            }
            var parsedBody = JSON.parse(body);
            res.render("home", {body:parsedBody.result});
          });
});

app.listen(3000, function(){
  console.log("dashboard started");
});
