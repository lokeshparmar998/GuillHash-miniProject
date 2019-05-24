const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    image: {
        data: Buffer, contentType: String
    }
})
var user = mongoose.model('user',userSchema);
module.exports = user;