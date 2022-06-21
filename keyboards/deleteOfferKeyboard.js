const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const deleteOfferKeyboard = new InlineKeyboard();

deleteOfferKeyboard
.add('❌ Удалить оффер ❌', 'delete_offer');

module.exports = deleteOfferKeyboard;
