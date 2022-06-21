const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const startKeyboard = new InlineKeyboard();

startKeyboard.add('✅ Отправить анкету ✅', 'accepted_rules');

module.exports = startKeyboard;
