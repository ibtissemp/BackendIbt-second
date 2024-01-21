var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Unite7300 = new Schema({
  userID:{
    type:String
  },  
  ph:{
    type:Number
  },
  c:{
    type:Number
  },
  poste:{
    type:Number
  },
  echantillon:{
    type:String
  },
  submissionTime: Date,
  postIndex: Number                  
});

module.exports = mongoose.model('unite7300s', Unite7300);