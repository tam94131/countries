// var CountryDB = require('../../models/countries');
// var CountryDB = require('../models/countries');
// var CountryDB = require('/models/countries');
// var CountryDB = require('models/countries');
// var CountryDB = require('./models/countries');
// console.log(CountryDB);

$(document).ready(function(){

	/* GET for api/profile .. myProfile div */
  	$.ajax({
   		method: 'GET',
   		url: 'http://localhost:3000/api/profile',
   		success: function (json) {
   			$('#myProfile').html(`<img id="profilePic" 
   				src="../public/images/Tahl_professional.jpg">
   				<p> Hi I'm ${json.name} and I live in ${json.currentCity}. </p>`);
   			// console.log (json);
   		},
   		error: handleError
 	});

    // message: "Welcome to my personal API! Here's what you need to know!",
    // documentationUrl: "https://github.com/tam94131/express_personal_api/README.md", 
    // baseUrl: "TBD", 
    // endpoints: [
    //   {method: "GET",    path: "/api", description: "Describes all available endpoints"},
    //   {method: "GET",    path: "/api/profile", description: "Data about me"},
    //   {method: "GET",    path: "/api/countries", description: "Get a list of countries I've visited"},
    //   {method: "POST",   path: "/api/countries", description: "Create a new country entry"},
    //   {method: "GET",    path: "/api/countries/:id", description: "Show a particular country"},
    //   {method: "GET",    path: "/api/countries/search?q=foo", description: "Show countries matching the query string"},
    //   {method: "PUT",    path: "/api/countries/:id", description: "Update a particular country"},
    //   {method: "DELETE", path: "/api/countries/:id", description: "Delete a particular country"}
    // ]

  	$.ajax({
  		method: 'GET',
  		url: 'http://localhost:3000/api',
  		success: function (json) {
  			$('#apiInstructions').html(`<p>${json.message} To read the doc, visit
  				${json.documentationUrl}.</p><p>Here are the endpoints:<br>` );
  			for (j=0; j<json.endpoints.length; j++) {
  				$('#apiInstructions').append(`Method: ${json.endpoints[j].method}, 
  					Path: ${json.endpoints[j].path} and Description: 
  					${json.endpoints[j].description}.<br>`);
  			}
  			$('#apiInstructions').append('</p>');
  		}
  	})

  	$.ajax({
   		method: 'GET',
   		url: 'http://localhost:3000/api/countries',
   		success: function (json) {
   			for (j=0; j<json.data.length; j++){
   				$('#listCountries').append(`I visited ${json.data[j].name} 
   					about ${json.data[j].visits} times.  Why? 
   					${json.data[j].whyIWent}.<br>`);
   			// console.log(j);
   			}
   		},
   		error: handleError
 	});

 	function handleError(xhr, status, errorThrown) {
   		console.log('uh oh',xhr,status,errorThrown);
 	}


  $('#countryForm').on('submit', function(event) {
  	console.log("Form submitted");
  	event.preventDefault();

            $.ajax({
                url: 'http://localhost:3000/api/countries',
                dataType: 'text',
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                data: $(this).serialize(),
                success: function( data, textStatus, jQxhr ){
                    console.log("Success", data, textStatus);
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });

	});		//form
//****


});		//DOM loaded
