const {Composer, Scenes} = require('telegraf');
const {getAllWorkers} = require('../controllers/workerController.js');

const makeSendAll = new Composer();

makeSendAll.on('text', async (ctx) => {
    try {
        const message = ctx.update.message.text;
        console.log(message);
        if(!message) {
            return;
        }
        const workers = await getAllWorkers();
        console.log(workers)
        for (const worker of workers) {
            await ctx.telegram.sendMessage(worker.userId, message);
        }
    } catch (error) {
        console.log(error.message);
    }
    finally {
        await ctx.reply('✅ Отправлено ✅');
        await ctx.scene.leave();
    }
});

const sendAllWorkersWizard = new Scenes.WizardScene('sendAllWorkersWizard', async (ctx) => {
    await ctx.reply('Какое сообщение вы хотите всем отправить?')
    ctx.wizard.next();
}, makeSendAll);

module.exports = sendAllWorkersWizard;