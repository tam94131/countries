// require express and other modules
var express = require('express'), 
  app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));


// console.log("server.js has (re-)started!");


/************
 * DATABASE *
 ************/
var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/personal-api");

var CountryDB = require('./models/countries');
// var CountryDB = require('./models');

var homeBase = new CountryDB({
  name: "USA",
  visits: 100,
  whyIWent: "I was born here",
  highlights: "'Life' is a highlight!"
});

homeBase.save( function(err, newCountry){
    console.log("We had a save!");
    if(err) {return console.log(err);}
    console.log("saved new person: ", newCountry);
});


var meProfile = {
  name: "Tahl Milburn",
  githubLink: "https://github.com/tam94131",
  githubProfileImage: "images/Tahl_professional.jpg",
  personalSiteLink: "https://tam94131.github.io/",
  currentCity: "San Francisco",
  pets: [{Name: "Hera", type: "Cat", breed: "Calico longhair"}]
}

var countries = [ 
  {_id: 1, 
  name: "Singapore",
  visits: 3, 
  whyIWent: "Company offsite, practice development",
  highlights: "Creative buildings, food courts, weather"},
  {_id: 2, 
  name: "Colombia",
  visits: 2, 
  whyIWent: "Project for Ecopetrol",
  highlights: "Pollution, party buses, bulletproof vests"},
  {_id: 3, 
  name: "Norway",
  visits: 1, 
  whyIWent: "Project for BBS",
  highlights: "People herding behavior, caves"},
  {_id: 4, 
  name: "Italy",
  visits: 1, 
  whyIWent: "Vacation!",
  highlights: "Vactican museums, food, ruins everywhere"},
  {_id: 5, 
  name: "Eastern Germany",
  visits: 1, 
  whyIWent: "To cross the Iron Curtain",
  highlights: "Saw how a communist frontier country looks"},
  {_id: 6, 
  name: "Hong Kong",
  visits: 4, 
  whyIWent: "Project for Ocean Park + visit friends",
  highlights: "Wet markets, Victoria Harbor, density"},
  ];


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function apiIndex(req, res) {
  res.json({
    message: "Welcome to my personal API! Here's what you need to know!",
    documentationUrl: "https://github.com/tam94131/express_personal_api/README.md", 
    baseUrl: "TBD", 
    endpoints: [
      {method: "GET",    path: "/api", description: "Describes all available endpoints"},
      {method: "GET",    path: "/api/profile", description: "Data about me"},
      {method: "GET",    path: "/api/countries", description: "Get a list of countries I've visited"},
      {method: "POST",   path: "/api/countries", description: "Create a new country entry"},
      {method: "GET",    path: "/api/countries/:id", description: "Show a particular country"},
      {method: "GET",    path: "/api/countries/search?q=foo", description: "Show countries matching the query string"},
      {method: "PUT",    path: "/api/countries/:id", description: "Update a particular country"},
      {method: "DELETE", path: "/api/countries/:id", description: "Delete a particular country"}
    ]
  })
});

app.get('/api/profile', function index(req, res) {
  /* Get list of all countries */
  res.json(meProfile);
});

app.get('/api/countries', function index(req, res) {
  /* Get list of all countries */
  res.send({"data": countries});
  // res.json({"data": countries});
});

app.get('/api/countries/search', function search(req, res) {
  /* This endpoint responds with the search results from the
   * query in the request. */
  let searchTerm = req.query.q.toLowerCase();
  let newArray = [];
  for (j=0; j<countries.length; j++) {
    if (countries[j].name.toLowerCase() === searchTerm) {
        newArray.push(countries[j]);
    }
  }
  res.json({"data": newArray});
});

app.post('/api/countries', function create(req, res) {
  /* This endpoint will add a todo to our "database"
   * and respond with the newly created todo.
   */
    let newCountry = req.body;
    let newObj = new Object;

    console.log(newCountry);
    newObj._id  = countries[countries.length-1]._id + 1;
    newObj.name = newCountry.name;
    newObj.visits = parseInt(newCountry.visits);
    newObj.whyIWent = newCountry.whyIWent;
    newObj.highlights = newCountry.highlights;

    countries.push(newObj);
    res.json(newObj);
});

app.get('/api/countries/:id', function show(req, res) {
  /* This endpoint will return a single country with the
   * id specified in the route parameter (:id)
   */
  let ID = req.params.id;
  var theElement = countries.find( function(item) {
    return item._id.toString() === ID;
  });
  if (theElement) {
    res.json(theElement);
  }
});

app.put('/api/countries/:id', function update(req, res) {
  /* This endpoint will update a single country with the
   * id specified in the route parameter (:id) and respond
   * with the newly updated country.
   */
  let ID = req.params.id;
  console.log("update requested");
  var theElement = countries.find( function(item,thisIndex) {
    console.log("found a country for update");
    return item._id.toString() === ID;
  });
  if (theElement) {
    console.log("equating parms");
    theElement.name = req.body.name;
    theElement.visits = parseInt(req.body.visits);
    theElement.whyIWent = req.body.whyIWent;
    theElement.highlights = req.body.highlights;
    res.json(theElement);
  }
});

app.delete('/api/countries/:id', function destroy(req, res) {
  /* This endpoint will delete a single country with the
   * id specified in the route parameter (:id) and respond
   * with success.
   */
  let ID = req.params.id;
  let indexArr = -1;
  for (j=0; j<countries.length; j++) {
    if (countries[j]._id.toString() === ID) {
      indexArr = j;
      break;
    }
  }
  if (indexArr=>0) {
    countries.splice(indexArr,1);
    res.json(countries[indexArr]);
  }
});



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
