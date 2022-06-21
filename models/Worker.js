const mongoose = require('mongoose');

const Worker = new mongoose.Schema({
    teamLeaderId: String,
    userId: String,
    balance: {
        type: Number,
        default: 0,
    },
    hold: {
      type: Number,
      default: 0,
    },
    registered: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Worker', Worker);
