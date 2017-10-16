var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var countriesSchema = new Schema({
  name: String,
  visits: Number,
  whyIWent: String,
  highlights: String
});

var Countries = mongoose.model('Countries', countriesSchema);

module.exports = Countries;

console.log("countries.js ran");