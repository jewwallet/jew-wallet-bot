const Keyboard = require('./Keyboard.js');

const teamLeaderKeyboard = new Keyboard();

teamLeaderKeyboard
    .add('💼 Офферы 💼')
    .add('📈 Cтатистика 📈')
    .add('📲 Мой чат 📲')
    .add('🔗 Ссылка-приглашение 🔗');

module.exports = teamLeaderKeyboard.keyboard.oneTime().resize();
