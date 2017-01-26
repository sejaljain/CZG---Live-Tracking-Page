var express = require("express");
var cors = require('cors'); 
var mysql   = require("mysql");
var bodyparser = require("body-parser");
var md5 = require("MD5")
//var rest = require("./REST.js");
var app  = express();
app.use(cors());
app.use(bodyparser.json()); // Body parser use JSON data
/* Connect to Database */
var connection = mysql.createConnection({
  host:'X',
  user:'X',
  password:'X',
  database:'X',
})


connection.connect(function(error){
  if(error) {
    console.log("Problem with MySQL "+ error);
  }
  else {
    console.log("Connected with Database");
  }
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://mapbox.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* Start Server 
app.get('/', function(req, res){
  res.redirect('public/index.html');
});*/


app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

app.use(express.static('public'));


//get all data of a particular device
app.get("/devices/:DeviceID", function(req,res){
  var query = "SELECT * FROM ?? WHERE ??=?";
  var table = ["datatab","DeviceID",req.params.DeviceID];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      res.json({"Error" : false, "Message" : "Success", "This Device" : rows});
    }
  });
})

app.get("/poi/centers", function(req,res){
  var query = "SELECT * FROM poi";
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      var points = []
      for(var i = 0; i<rows.length; i++) {
        points.push({
            "geometry": {
                "type": "Point",
                "coordinates": [
                    parseFloat(rows[i].Longitude),
                    parseFloat(rows[i].Latitude)
                ]
            },
            "type": "Feature",
            "properties": {
                "description": rows[i].Name
            }
        });
      }
      res.json({"type": "FeatureCollection","features" : points});
    }
  });
})

//get all latitude and longitude of a device 
app.get("/latlng/:DeviceID", function(req,res){
  var query = "SELECT ??,?? FROM ?? WHERE ??=?";
  var table = ["latitude","longitude","datatab","DeviceID",req.params.DeviceID];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      res.json({"Error" : false, "Message" : "Success", "This Device" : rows});
    }
  });
})

//get last latitude andlongitude of a device
app.get("/lastlatlng/:DeviceID", function(req,res){
  var query = "SELECT * FROM ?? WHERE ??=? ORDER BY id DESC LIMIT 1";
  var table = ["datatab","DeviceID",req.params.DeviceID];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      var time_st = rows[0].Date.substr(0,2) + "/" + rows[0].Date.substr(2,2) + "/" + rows[0].Date.substr(4,4) + " " + rows[0].Time.substr(0,2) + ":" + rows[0].Time.substr(2,2) + ":" + rows[0].Time.substr(4,2);
      var lat = parseFloat(rows[0].Latitude);
      var lng = parseFloat(rows[0].Longitude);
      res.json({"geometry":{"type":"Point","coordinates":[lng,lat]},"type":"Feature","properties":{"title": '', "description": '<b>Driver: Name<b><br>Speed: '+ rows[0].Speed+'<br>Time Stamp: ' + time_st + '<br>Address: '}});
    }
  });
})

app.get("/lastlatlngroute/:DeviceID/:Day", function(req,res){
  var query = "SELECT ??,?? FROM ?? WHERE ??=? AND ??=?";
  var table = ["latitude","longitude","datatab","DeviceID",req.params.DeviceID, "date", req.params.Day];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      var coord_array = []
      i = 0;
      while (i<rows.length) {
        coord_array.push([parseFloat(rows[i].longitude), parseFloat(rows[i].latitude)]);
        i = i + 1;
      }
      res.json({"geometry":{"type":"LineString","coordinates":coord_array},"type":"Feature","properties":{}});
    }
  });
})


app.get("/idstart/:DeviceID/:day/:t/", function(req,res) {
  var query = "SELECT ?? FROM ?? WHERE ??=? and ??=? and ??>=? ORDER BY id ASC LIMIT 1";
  var table = ["id","datatab","DeviceID",req.params.DeviceID,"Date",req.params.day,"Time",req.params.t];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      res.json(rows[0].id);
    }
  });
})


app.get("/idend/:DeviceID/:day/:t/", function(req,res) {
  var query = "SELECT ?? FROM ?? WHERE ??=? and ??=? and ??<=? ORDER BY id DESC LIMIT 1";
  var table = ["id","datatab","DeviceID",req.params.DeviceID,"Date",req.params.day,"Time",req.params.t];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      res.json(rows[0].id);
    }
  });
})

app.get("/route/:DeviceID/:day_start/:time_start/:day_end/:time_end", function(req,res) {

  var query = 'SELECT latitude,longitude from datatab where DeviceID = ? and date >= ? and date <=? and time >= ? and time <= ?';
  var table = [req.params.DeviceID,req.params.day_start,req.params.day_end,req.params.time_start,req.params.time_end];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } 
    else {
      var coord_array = []
      i = 0;
      while (i<rows.length) {
        coord_array.push([parseFloat(rows[i].longitude), parseFloat(rows[i].latitude)]);
        i = i + 1;
      }
      res.json({"geometry":{"type":"LineString","coordinates":coord_array},"type":"Feature","properties":{}});
    }
  });
})


//get speed of device
app.get("/speed/:DeviceID", function(req,res) {
  var query = "SELECT ??,?? FROM ?? WHERE ??=? ORDER BY id DESC LIMIT 2";
  var table = ["latitude","longitude","datatab","DeviceID",req.params.DeviceID];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {


      var lat1 = parseFloat(rows[0].latitude)* 3.14159 / 180.0;
      var lon1 = parseFloat(rows[0].longitude) * 3.14159 / 180.0;
      var lat2 = parseFloat(rows[1].latitude)* 3.14159 / 180.0;
      var lon2 = parseFloat(rows[1].longitude) * 3.14159 / 180.0;
      // radius of earth in metres
      var R = 6378100; // metres

      var dlon = lon2 - lon1;
      var dlat = lat2 - lat1;
      var a = (Math.sin(dlat/2.000)) * (Math.sin(dlat/2.000)) + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon/2.000)) *  (Math.sin(dlon/2.000));
      var c = 2.0000 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) ); 
      var d = R * c; 

      var s = d/30.0000;
      // Distance in Metres
      res.json({"speed" : s});
    }
  });
})
//get all alert messages
app.get("/alerts/", function(req,res){
  var query = "SELECT * FROM ?? WHERE ??=??";
  var table = ["datatab","datacode","TMALT"];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      res.json({"Error" : true, "Message" : "Error executing MySQL query."});
    } else {
      res.json({"Error" : false, "Message" : "Success", "This Device" : rows});
    }
  });
})


app.post("/poi/add", function(req, res) {
    var n_val = req.body.Name;
    var t_val = req.body.Type;
    var lat_val = req.body.Latitude;
    var lng_val = req.body.Longitude;
    console.log(req);
    console.log(req.body);
    console.log(n_val, t_val, lat_val, lng_val);
    var query = 'INSERT INTO poi (Name, Type, Latitude, Longitude) VALUES (?,?,?,?)';
    var table = [n_val, t_val, lat_val, lng_val];
    query = mysql.format(query,table);
    connection.query(query, function(error) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('success');    
        }
    });
})



app.listen(3000, function() {
  console.log("Alive on Port 3000");
});



