const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, unique: true},
    password: String,
    groups: Map,
    friends: Map,
    bio: String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;