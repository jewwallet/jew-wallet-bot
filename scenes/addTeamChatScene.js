const {Scenes, Composer} = require('telegraf');
const {createTeamChat, getTeamChat} = require('../controllers/teamChatController.js');
const {isTeamLeader} = require('../controllers/teamLeaderController.js');


const handleChatLink = new Composer();

handleChatLink.on('text', async (ctx) => {
   const {text: link} = ctx.update.message;
   const {id: userId} = ctx.update.message.from;

   if(!(await isTeamLeader({userId}))) {
       await ctx.reply('🚫 Отказано в доступе! 🚫');
       return await ctx.scene.leave();
   }
   if (link.startsWith('https://t.me/')) {
       if (await getTeamChat({inviteLink: link})) {
           return await ctx.reply('🚫 Отказано в доступе! 🚫');
       }
       await ctx.reply('Отлично! Теперь пригласите бота в чат, сделайте его администратором и пришлите ссылку в чат для его добавления.');
       const newTeamChat = await createTeamChat({inviteLink: link, teamLeaderId: userId});

       if (newTeamChat) {
           await ctx.reply('✅ Чат успешно добавлен! ✅');
           await ctx.scene.leave();
       }
   }
});

const addTeamChatWizard = new Scenes.WizardScene('addTeamChatWizard', async (ctx) => {
    await ctx.reply('Пришлите ссылку на свой чат');
    await ctx.wizard.next();
}, handleChatLink);

module.exports = addTeamChatWizard;
