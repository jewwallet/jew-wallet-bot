const Keyboard = require('../keyboards/Keyboard.js');

const workerKeyboard = new Keyboard();

workerKeyboard
.add('💼 Офферы 💼')
    .add('❓ Информация ❓')
    .add('💳 Запросить выплату 💳');

module.exports = workerKeyboard.keyboard.oneTime().resize();
