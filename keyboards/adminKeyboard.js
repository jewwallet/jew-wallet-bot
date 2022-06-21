const Keyboard = require('../keyboards/Keyboard.js');

const adminKeyboard = new Keyboard();

adminKeyboard
.add('📝 Отправить сообщение воркерам 📝')
    .add('📝 Отправить сообщение тимлидам 📝')
    .add('📈 Статистика проекта 📈')


module.exports = adminKeyboard.keyboard.oneTime().resize();
