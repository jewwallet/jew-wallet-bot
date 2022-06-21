const {Composer, Scenes} = require('telegraf');
const {getAllTeamLeaders} = require('../controllers/teamLeaderController');``

const makeSendAll = new Composer();

makeSendAll.on('text', async (ctx) => {
    try {
        const message = ctx.update.message.text;
        console.log(message);
        if(!message) {
            return;
        }
        const teamleaders = await getAllTeamLeaders();
        console.log(teamleaders)
        for (const teamleader of teamleaders) {
            await ctx.telegram.sendMessage(teamleader.userId, message);
        }
    } catch (error) {
        console.log(error.message);
    }
    finally {
        await ctx.reply('✅ Отправлено ✅');
        await ctx.scene.leave();
    }
});

const sendAllTeamleadersWizard = new Scenes.WizardScene('sendAllTeamleadersWizard', async (ctx) => {
    await ctx.reply('Какое сообщение вы хотите всем отправить?')
    ctx.wizard.next();
}, makeSendAll);

module.exports = sendAllTeamleadersWizard;