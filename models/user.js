var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({

    fname: {
        type: String      
      },
    lname: {
        type: String     
      },
    number: {
        type: Number
      },
    email: {
        type: String,
        required: true,
        unique: true,
      },
    password: {
        type: String,
        required: true,
      }
      
});

module.exports = mongoose.model('users', User);