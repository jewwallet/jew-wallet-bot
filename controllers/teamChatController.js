const TeamChat = require('../models/TeamChat');

module.exports = {
  async createTeamChat({inviteLink, teamLeaderId}) {
      try {
          const newTeamChat = new TeamChat({inviteLink, teamLeaderId});
          await newTeamChat.save();
          return newTeamChat;
      } catch(error) {
          console.log(error.message);
      }
  },
  async getTeamChat({inviteLink, chatId, teamLeaderId}) {
      try {
          let foundTeamChat;
          if (inviteLink) {
              console.log('Invite Link for database', inviteLink);
              foundTeamChat = (await TeamChat.find({inviteLink}))[0];
          }
          if (chatId) {
              foundTeamChat = (await TeamChat.find({chatId}))[0];
          }
          else {
              foundTeamChat = (await TeamChat.find({teamLeaderId}))[0];
          }
          console.log('Database data', foundTeamChat);
          return foundTeamChat;
      } catch(error) {
          console.log(error.message);
      }
  },
    async hasTeamChat(userId) {
            try {
                return !!(await TeamChat.find({teamLeaderId: userId}))[0];
            }  catch(error) {
                console.log(error.message);
            }
    }
};
