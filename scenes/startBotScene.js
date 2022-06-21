const {Scenes, Composer} = require('telegraf');

const {isTeamLeader, addTeamLeader, getTeamLeader, sendWorkSheet} = require('../controllers/teamLeaderController.js');

const startKeyboard = require("../keyboards/startKeyboard.js");
const teamLeaderKeyboard = require('../keyboards/teamLeaderKeyboard.js');

const onAccepted = new Composer();

onAccepted.action('accepted_rules', async (ctx) => {
    try {
        const userId = ctx.update.callback_query.from.id;
        const userName = ctx.update.callback_query.from.username;

        const startPayload = ctx.session.startPayload || 'wine_berg';

        ctx.session.userName = userName;
        ctx.session.userId = userId;

        let currentTeamLeader = await getTeamLeader({userName: startPayload});
        if (!currentTeamLeader) {
           currentTeamLeader = await getTeamLeader({userName: 'wine_berg'});
        }
        ctx.deleteMessage();
        await sendWorkSheet({teamLeaderId: currentTeamLeader.chatId, ctx});
        await ctx.telegram.sendMessage(userId, '🕓 Ждите одобрения руководства 🕓');
    }
    catch (error) {
        console.log(error.message);
    }
    finally {
      await ctx.scene.leave();
    }


});

const startBotWizard = new Scenes.WizardScene('startBotWizard', async (ctx) => {
    await ctx.replyWithHTML(`👋 Привет!

✅ <b>Мы даём шанс поднять солидный кэш, не выходя из дома.</b>

✅ <b>Работа подойдёт любому желающему - ограничений по возрасту у нас нет.</b>

✅ <b>Мы за легальный и белый ворк</b>.

✅ <b>Заработок от 1 000р в день</b>.

👇 Если тебе интересно, нажимай на "Отправить анкету" и следуй дальнейшим инструкциям 👇`, startKeyboard.keyboard);
    ctx.session.startPayload = ctx.startPayload;
    await ctx.wizard.next();
}, onAccepted);

module.exports = startBotWizard;
