const TeamLeader = require('../models/TeamLeader.js');
const workSheetKeyboard = require('../keyboards/workSheetKeyboard.js');
const createPaymentKeyboard = require('../keyboards/createPaymentKeyboard.js');

module.exports = {
 async isTeamLeader({userId, userName}) {
      try {
          let neededTeamLeader;

          if(!userName) {
              neededTeamLeader = (await TeamLeader.find({userId}))[0];
          }

          if(!userId) {
              neededTeamLeader = (await TeamLeader.find({userName}))[0];
          }

          return !!neededTeamLeader;
      } catch(error) {
          console.log(error.message);
      }
  },
    async addTeamLeader({userId, chatId, userName = 'Unknown'}) {
     try {
         const newTeamLeader = new TeamLeader({
             userId,
             chatId,
             userName,
         });
         await newTeamLeader.save();
         return newTeamLeader;
     } catch(error) {
         console.log(error.message);
     }
    },
    async getTeamLeader({userName, userId}) {
     try {
         let teamLeader;
         if (userName) {
             teamLeader = (await TeamLeader.find({userName}))[0];
         }
         if (userId) {
             teamLeader = (await TeamLeader.find({userId}))[0];
         }
         console.log(teamLeader);
         return teamLeader;
     } catch(error) {
         console.log(error.message);
     }
    },
    async sendWorkSheet({teamLeaderId, ctx}) {
          const userName = ctx.session.userName;
          const userId = ctx.session.userId;

         await ctx.telegram.sendMessage(teamLeaderId, `🔔 Новая анкета\n👤 Имя пользователя: @${userName}\n🆔 ID: ${userId}
          `, workSheetKeyboard.keyboard);
         return true;
    },

    async sendPaymentRequest({ctx}) {
       const {currentWorker, cardNumber, bankName} = ctx.session;
       await ctx.telegram.sendMessage(currentWorker.teamLeaderId, `🔔 Запрос на выплату\n🆔 ID: ${currentWorker.userId}\n💳 Карта: ${cardNumber}\n🏦 Банк: ${bankName}\n💰 Сумма на выплату: ${currentWorker.balance}₽`, createPaymentKeyboard);
    },
    async getAllTeamLeaders() {
        return (await TeamLeader.find());
    }
};

