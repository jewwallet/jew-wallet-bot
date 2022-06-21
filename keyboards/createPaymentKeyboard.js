const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const createPaymentKeyboard = new InlineKeyboard();

createPaymentKeyboard
.add('Выплатить', 'create_payment')
.add('Отказать', 'decline_payment');

module.exports = createPaymentKeyboard.keyboard;