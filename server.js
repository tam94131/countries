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

console.log("Server has started!");


/************
 * DATABASE *
 ************/

// var db = require('./models');

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

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));


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
    message: "Welcome to my personal api! Here's what you need to know!",
    documentationUrl: "https://github.com/tam94131/express_self_api/README.md", 
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
  /* Get list of all todos */
  res.json(meProfile);
});

app.get('/api/countries', function index(req, res) {
  /* Get list of all todos */
  // res.send({"data": countries});
  res.json({"data": countries});
});

// app.post('/api/collecto', function create(req, res) {
//   /* add a new entry */
//     let newTodo = req.body;
//     let newObj = new Object;
//     newObj._id  = todos[todos.length-1]._id + 1;
//     newObj.task = newTodo.task;
//     newObj.description = newTodo.description;
//     todos.push(newObj);
//     res.json(newObj);
// })



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
