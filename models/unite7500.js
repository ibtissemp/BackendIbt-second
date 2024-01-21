
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Unite7500 = new Schema({
  userID:{
    type:String
  },

ph:{
  type:Number
},
poste:{
  type:String
},
acidete:{
  type:Number
},
catégorie:{
  type:Number
},
heure:{
  type:Date
},
soufre:{
  type:Number
},






  /*phChaudiere: Number,
  cChaudiere:Number,
  co05cendre:Number,
  do01cendre:Number,
  do02cendre:Number,
  filo01cendre:Number,
  filo02cendre:Number,
  co05bitume:Number,
  do01bitume:Number,
  do02bitume:Number,
  filo01bitume:Number,
  filo02bitume:Number,
  co05acide:Number,
  do01acide:Number,
  do02acide:Number,
  filo01acide:Number,
  filo02acide:Number,
  facteurCorrection:Number,
  acidited021:Number,
  acidited022:Number,
  submissionTime: Date,
  ph51:Number,
  ph52:Number,
  ph53:Number,
  ph55:Number,
  postIndex: Number   */               
});

module.exports = mongoose.model('unite7500s', Unite7500);