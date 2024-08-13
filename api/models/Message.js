const mongoose = require("mongoose");
const messageScheme = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now },
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
    isNotif: {type: Boolean, default: false}
});

const messageModel = mongoose.model('Message', messageScheme);

module.exports = messageModel;