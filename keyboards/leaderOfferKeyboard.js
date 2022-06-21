const InlineKeyboard = require('../keyboards/InlineKeyboard.js');

const leaderOfferKeyboard = new InlineKeyboard();

leaderOfferKeyboard
.add('💼 Мои офферы 💼',  'my_offers')
.add('➕ Добавить оффер ➕', 'add_offer');



module.exports = leaderOfferKeyboard
