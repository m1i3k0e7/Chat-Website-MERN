const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    biography: String,
    contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;