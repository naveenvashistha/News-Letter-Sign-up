require('dotenv').config();
const express = require("express");
const app = express();
const https = require("https");

app.use(express.urlencoded());
app.use(express.static("public"))

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signUp.html");
});

app.post("/", function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  var memberDetails = {
    members:[ {
       email_address: email,
       status:"subscribed",
       merge_fields: {
         FNAME: firstName,
         LNAME: lastName
       }
     }
   ],
   update_existing: true
   };
  var memberDetailsJSON = JSON.stringify(memberDetails);
  var url = "https://us6.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;
  var options = {
    method: "POST",
    auth: "naveen:"+process.env.API_KEY
  };
  var request = https.request(url,options,function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
          console.log(JSON.parse(data));

    });
  });
  request.write(memberDetailsJSON);
  request.end();
});

app.post("/failure",function(req,res){
  res.sendFile(__dirname+"/signUp.html");
})



app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000");
})

// link for the app: https://secure-savannah-61727.herokuapp.com/
