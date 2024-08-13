const mongoose = require("mongoose");

const chatScheme = new mongoose.Schema({
    isGroupChat: {type: Boolean, default: false},
    chatName: {type: String},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    lastText: {type: String, required: true},
    lastTextTime: {type: Date, required: true, default: Date.now}
});

const chatModel = mongoose.model('Chat', chatScheme);

module.exports = chatModel;