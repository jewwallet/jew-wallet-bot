const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const workSheetKeyboard = new InlineKeyboard();

workSheetKeyboard
.add('Принять', 'accept_work')
.add('Отклонить', 'decline_work');

module.exports = workSheetKeyboard;
