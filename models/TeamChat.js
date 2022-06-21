const mongoose = require('mongoose');

const TeamChat = new mongoose.Schema({
    inviteLink: String,
    chatId: String,
    teamLeaderId: String,
});

module.exports = mongoose.model('TeamChat', TeamChat);

