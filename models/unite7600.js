var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Unite7600 = new Schema({
  userID:{
    type:String
  },
 
P2O5:{
type:
Number
},
CaO:{
  type:Number
},
humidite:{
  type:Number
},
densite:{
  type:Number
},
T:{
  type:Number
},
tauxdesolide:{
  type:Number
},
H2SO4:{
  
  type:Number},
MS:{
  type:Number
},
FilterA:{
  type:Number
},
FilterB:{type:Number},
FilterC:{type:Number},
FilterD:{type:Number},
lavable:{type:Number},
Syncristallise:{type:Number},
Intaque:{type:Number},
attaque:{type:Number},
Filtration:{type:Number},
chimique:{type:Number},


});

module.exports = mongoose.model('unite7600s', Unite7600);