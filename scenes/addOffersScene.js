const {Composer, Scenes} = require('telegraf');
const shortcut = require('../utils/shortcutter.js');
const {addOffer} = require('../controllers/offerController.js');


const offerNameHandler = new Composer();
const offerLinkHandler = new Composer();
const paymentInfoHandler = new Composer();
const priceOfferHandler = new Composer();

offerNameHandler.on('text', ctx => {
      try {
          const {text: offerName} = ctx.update.message;
          if(!offerName) {
              return ctx.scene.leave();
          }
          ctx.session.offerName = offerName;
          ctx.reply('Пришлите свою реферальную ссылку');
          ctx.wizard.next();
      } catch(error) {
          ctx.reply(error.message);
      }
});


offerLinkHandler.on('text', ctx => {
    try {
        const {text: offerLink} = ctx.update.message;
        if(!offerLink || !offerLink.startsWith('https://')) {
            return ctx.scene.leave();
        }
        ctx.session.offerLink = offerLink;
        ctx.reply('Расскажите про целевое действие');
        ctx.wizard.next();
    } catch(error) {
        ctx.reply(error.message);
    }
});


paymentInfoHandler.on('text', ctx => {
    try {
        const {text: paymentInfo} = ctx.update.message;
        if(!paymentInfo) {
            return ctx.scene.leave();
        }
        ctx.session.paymentInfo = paymentInfo;
        ctx.reply('Установите вознаграждение для работника');
        ctx.wizard.next();
    } catch(error) {
        ctx.reply(error.message);
    }
});

priceOfferHandler.on('text', async (ctx) => {
    try {
        const {text: price, from: {id: teamLeaderId}} = ctx.update.message;

        if(!price) {
            return ctx.scene.leave();
        }

        let {offerName, offerLink, paymentInfo} = ctx.session;

        const offerLinkURL = new URL(offerLink);
        offerLinkURL.searchParams.append('worker_profit', price);
        offerLink = await shortcut(offerLinkURL.href);
        await addOffer({name: offerName, offerLink, paymentInfo, price, teamLeaderId});
        await ctx.reply('✅ Оффер успешно добавлен  ✅');
        await ctx.scene.leave();
    } catch(error) {
        ctx.reply(error.message);
    }
});

const addOffersWizard = new Scenes.WizardScene('addOffersWizard',
    async (ctx) => {
   await ctx.reply('Как будет называться ваш оффер?');
   await ctx.wizard.next();
}, offerNameHandler,
    offerLinkHandler,
    paymentInfoHandler,
    priceOfferHandler);

module.exports = addOffersWizard;
