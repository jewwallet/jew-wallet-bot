const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const editChatKeyboard = new InlineKeyboard();

editChatKeyboard
.add('Да', 'edit_teamleader_chat')
.add('Нет', 'no_edit_teamleader_chat');

module.exports = editChatKeyboard;
