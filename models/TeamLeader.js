const mongoose = require('mongoose');

const TeamLeader = new mongoose.Schema({
    userId: String,
    chatId: String,
    userName: String,
});

module.exports = mongoose.model('TeamLeader', TeamLeader);