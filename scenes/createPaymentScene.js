const {Scenes, Composer} = require('telegraf');
const {sendPaymentRequest} = require('../controllers/teamLeaderController.js');
const {getWorker} = require('../controllers/workerController.js');

const cardNumberHandler = new Composer();

cardNumberHandler.on('text', async (ctx) => {
     try {
         const cardNumber = ctx.update.message.text;
         ctx.session.cardNumber = cardNumber;
         ctx.reply('🏦 Введите название банка, в которой будет осуществляться выплата 🏦');
         await ctx.wizard.next();
     } catch (error) {
         console.log(error.message);
     }
});

const bankNameHandler = new Composer();

bankNameHandler.on('text', async (ctx) => {
    try {
        const bankName = ctx.update.message.text;
        ctx.session.bankName = bankName;

        await sendPaymentRequest({ctx});
        await ctx.replyWithHTML('✅ Запрос отравлен вашему руководителю. Ждите одобрения. ✅');
        await ctx.scene.leave();
    } catch (error) {
        console.log(error.message);
    }
});

const createPaymentWizard = new Scenes.WizardScene(
    'createPaymentWizard',
    async (ctx) => {
         ctx.session.currentWorker = await getWorker(ctx.update.message.from.id);
         await ctx.reply('💳 Введите номер карты для вывода средств 💳');
         return ctx.wizard.next();
    },
    cardNumberHandler,
    bankNameHandler,
);

module.exports = createPaymentWizard;