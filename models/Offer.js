const mongoose = require('mongoose');

const Offer = new mongoose.Schema({
   name: String,
   price: Number,
   paymentInfo: String,
   offerLink: String,
   teamLeaderId: String,
});

module.exports = mongoose.model('Offer', Offer);
