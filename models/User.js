let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let validator = require('validator');


const UserSchema = new Schema({
   email: {
       type: String, 
       unique: [true,"Email is already registered"], 
       validate: {
           validator: email => validator.isEmail(email)
    },
    required: [true, "Email is required"]
   },
   password: {type: String},
   contacts: [{type: String}]
});


let User = mongoose.model('User',UserSchema);


module.exports = User;