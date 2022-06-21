const Offer = require('../models/Offer.js');

module.exports = {
   async addOffer({name, price, paymentInfo, offerLink, teamLeaderId}) {
      try {
         const newOffer = new Offer({name, price, paymentInfo, offerLink, teamLeaderId});
         await newOffer.save();
         return newOffer;
      } catch(error) {
         console.log(error.message);
      }
   },
   async hasOffers(teamLeaderId) {
      try {
         const offers = await Offer.find({teamLeaderId});
         return !!offers.length;
      } catch(error) {
         console.log(error.message);
      }
   },
   async getOffers(teamLeaderId) {
      try {
         const offers = Offer.find({teamLeaderId});
         return offers;
      } catch(error) {
         console.log(error.message);
      }
   },
    async deleteOffer({teamLeaderId, name}) {
       try {
           const currentOffer = (await Offer.find({name, teamLeaderId}))[0];
           if (currentOffer) {
               await currentOffer.remove();
           }
       } catch(error) {
           console.log(error.message);
       }
    }
};
