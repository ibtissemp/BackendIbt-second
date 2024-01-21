var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Unite7980 = new Schema({
  ph: Number,
  submissionTime: Date,
  postIndex: Number                  
});

module.exports = mongoose.model('unite7980s', Unite7980);