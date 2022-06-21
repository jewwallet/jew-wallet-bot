const {Telegraf, Scenes, session} = require('telegraf');
const {token, databaseURL} = require('../env.json');

const herokuWaiter = require('../utils/heroku_waiter.js');
const mongoose = require('mongoose');
const express = require('express');

const {isTeamLeader, addTeamLeader, getTeamLeader, getAllTeamLeaders} = require('../controllers/teamLeaderController.js');
const {addWorker, isWorker, getWorker, getWorkers, addBalance, addHold, resetBalance, minusHold, getAllWorkers} = require('../controllers/workerController.js');
const {getTeamChat, hasTeamChat} = require('../controllers/teamChatController.js');
const {hasOffers, getOffers, deleteOffer} = require('../controllers/offerController.js');

const teamLeaderKeyboard = require('../keyboards/teamLeaderKeyboard.js');
const adminKeyboard = require('../keyboards/adminKeyboard.js');
const workerKeyboard = require('../keyboards/workerKeyboard.js');
const deleteOfferKeyboard = require('../keyboards/deleteOfferKeyboard.js');
const leaderOfferKeyboard = require('../keyboards/leaderOfferKeyboard.js');

const startBotScene = require('../scenes/startBotScene.js');
const addOffersScene = require('../scenes/addOffersScene.js');
const addTeamChatScene = require('../scenes/addTeamChatScene.js');
const createPaymentScene = require('../scenes/createPaymentScene.js');
const sendAllWorkersScene = require('../scenes/sendAllWorkersScene.js');
const sendAllTeamleadersScene = require('../scenes/sendAllTeamleadersScene.js');

const server = express();
const stage = new Scenes.Stage([startBotScene, addOffersScene, addTeamChatScene, createPaymentScene, sendAllWorkersScene, sendAllTeamleadersScene]);
const bot = new Telegraf(token);

bot.use(session());
bot.use(stage.middleware());

server.get('/saleads/moderation', async (req, res) => {
    const {worker_id, worker_profit} = req.query;
    if(!worker_id || !worker_profit) {
        return;
    }
    if (await isWorker(worker_id)) {
        const currentWorker = await getWorker(worker_id);
        const currentTeamLeader = await getTeamLeader({userId: currentWorker.teamLeaderId});
        const currentTeamChat = await getTeamChat({teamLeaderId: currentWorker.teamLeaderId});
        await addHold({userId: worker_id, hold: worker_profit});
        if (currentTeamChat && currentTeamChat.chatId) {
            await bot.telegram.sendMessage(currentTeamChat.chatId, `🔔 <b>Уведомление</b>\n📍 <b>Поступила сумму в обработку</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
        }
        await bot.telegram.sendMessage(worker_id, `🔔 <b>Уведомление</b>\n📍 <b>Поступила сумму в обработку</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
    }
    res.end();
});

server.get('/saleads/approve', async (req, res) => {
    const {worker_id, worker_profit} = req.query;
    if (!worker_id || !worker_profit) {
        return;
    }
    if (await isWorker(worker_id)) {
        const currentWorker = await getWorker(worker_id);
        const currentTeamLeader = await getTeamLeader({userId: currentWorker.teamLeaderId});
        const currentTeamChat = await getTeamChat({teamLeaderId: currentWorker.teamLeaderId});
        await addBalance({userId: worker_id, balance: worker_profit});
        await bot.telegram.sendMessage(worker_id, `🔔 <b>Уведомление</b>\n📍 <b>Поступила сумму на ваш баланс</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
        if (currentTeamChat && currentTeamChat.chatId) {
            await bot.telegram.sendMessage(currentTeamChat.chatId, `🔔 <b>Уведомление</b>\n📍 <b>Поступила сумму на ваш баланс</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
        }
    }
    res.end();
});

server.get('/saleads/decline', async (req, res) => {
    const {worker_id, worker_profit} = req.query;
    if (await isWorker(worker_id)) {
        const currentWorker = await getWorker(worker_id);
        const currentTeamLeader = await getTeamLeader({userId: currentWorker.teamLeaderId});
        const currentTeamChat = await getTeamChat({teamLeaderId: currentWorker.teamLeaderId});
        await minusHold({userId: worker_id, hold: worker_profit});
        await bot.telegram.sendMessage(worker_id, `🔔 <b>Уведомление</b>\n📍 <b>Отклонена заявка</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
        if (currentTeamChat && currentTeamChat.chatId) {
            await bot.telegram.sendMessage(currentTeamChat.chatId, `🔔 <b>Уведомление</b>\n📍 <b>Отклонена заявка</b>\n💳 <b>Сумма:</b> ${worker_profit}₽\n🥷 <b>Руководитель: </b> @${currentTeamLeader.userName}`, {parse_mode: 'HTML'});
        }
    }
    res.end();
});

bot.start(async (ctx) => {

    const {id: userId, username: userName = 'Unknown'} = ctx.update.message.from;
    const startPayload = ctx.startPayload;

    if (startPayload === 'teamleader') {
        await addTeamLeader({userId, chatId: userId, userName});
        return await ctx.reply('🥷 Привет, TeamLeader! 🥷', teamLeaderKeyboard);
    }
    if (userName === 'galiaskarov_dev') {
        return ctx.reply('👨🏻‍💻 Админ панель 👨🏻‍💻', adminKeyboard);
    }

    if(await isTeamLeader({userId})) {
        return ctx.reply('🥷 Привет, TeamLeader! 🥷', teamLeaderKeyboard);
    }

    if(await isWorker(userId))  {
        return ctx.reply('👔 Worker панель 👔', workerKeyboard);
    }
    await ctx.scene.enter('startBotWizard');
});



bot.hears('💼 Офферы 💼', async (ctx) => {
    const {id: userId} = ctx.update.message.from;

    if(await isTeamLeader({userId})) {
        return await ctx.reply('Оффер-панель', leaderOfferKeyboard.keyboard);
    }
    if (await isWorker(userId)) {
        const currentWorker = await getWorker(userId);
        const offers = await getOffers(currentWorker.teamLeaderId);
        for (const offer of offers) {
            const offerURL = new URL(offer.offerLink);
            offerURL.searchParams.append('worker_id', userId);
            await ctx.replyWithHTML(`💼 <b>Название оффера</b>: ${offer.name}\n💳 <b>Цена:</b> ${offer.price}(₽)\n↗ <b>Целевое действие:</b> ${offer.paymentInfo}\n🔗 <a href="${offerURL.href}">Ссылка-приглашение</a>`);
        }
    }
})

bot.hears('💳 Запросить выплату 💳', async (ctx) => {
    try {
        const userId = ctx.update.message.from.id;
        const currentWorker = await getWorker(userId);
        if (!currentWorker.balance) {
            return await ctx.replyWithHTML('🚫 <b>Недостаточно средств!</b> 🚫');
        }
        return ctx.scene.enter('createPaymentWizard');
    } catch(error) {
        console.log(error.message);
    }
});

bot.hears('📝 Отправить сообщение воркерам 📝', async (ctx) => {
    if(ctx.update.message.from.username === 'galiaskarov_dev') {
        if((await getAllWorkers()).length > 0) {
            return ctx.scene.enter('sendAllWorkersWizard');
        }
    }
});

bot.hears('📝 Отправить сообщение тимлидам 📝', async (ctx) => {
    if (ctx.update.message.from.username === 'galiaskarov_dev') {
        if((await getAllTeamLeaders()).length > 0) {
            return ctx.scene.enter('sendAllTeamleadersWizard');
        }
    }
})

bot.hears('❓ Информация ❓', async (ctx) => {
    const userId = ctx.update.message.from.id;

    if(!(await isWorker(userId))) {
        return await ctx.reply('🚫 Отказано в доступе! 🚫');
    }

    const currentWorker = await getWorker(userId);
    const currentTeamChat = await getTeamChat({teamLeaderId: currentWorker.teamLeaderId});
    const currentTeamLeader = await getTeamLeader({userId: currentWorker.teamLeaderId});
    return await ctx.replyWithHTML(`🆔 <b>Ваш ID:</b> ${currentWorker.userId}\n💰 <b>Баланс:</b> ${currentWorker.balance}₽\n🕓 <b>Денег в обработке:</b> ${currentWorker.hold}₽\n🥷 <b>Ваш руководитель: </b>@${currentTeamLeader.userName}\n🔗 <a href="${currentTeamChat.inviteLink}">Ваш рабочий чат</a>`);
})

bot.action('send_message_all', ctx => {
    ctx.scene.enter('send_message_allWizard');
});

bot.action('add_offer', async (ctx) => {
    await ctx.scene.enter('addOffersWizard');
})

bot.action('edit_offers', async (ctx) => {
    const {id: userId} = ctx.update.callback_query.from;

    if(!(await isTeamLeader({userId}))) {
        return await ctx.reply('🚫 Отказано в доступе! 🚫');
    }
    return await ctx.reply('Оффер-панель', leaderOfferKeyboard.keyboard);
});

bot.action('my_offers', async (ctx) => {
    const {id: userId} = ctx.update.callback_query.from;
    if(await hasOffers(userId)) {
        const offers = await getOffers(userId);
        for (const offer of offers) {
            await ctx.replyWithHTML(`💼 <b>Название оффера</b>: ${offer.name}\n💳 <b>Цена:</b> ${offer.price}(₽)\n↗ <b>Целевое действие:</b> ${offer.paymentInfo}\n🔗 <a href="${offer.offerLink}">Ваша реферальная ссылка</a>`, deleteOfferKeyboard.keyboard);
        }
    }
    else {
        await ctx.reply('У вас нет ещё добавленных офферов!');
    }
})

bot.action('delete_offer', async (ctx) => {
const {from: {id: userId}, message: {text}} = ctx.update.callback_query;

if(!(await isTeamLeader({userId}))) {
    return await ctx.reply('🚫 Отказано в доступе! 🚫');
}

const offerName = text.split('\n').join(': ').split(': ')[1];
await deleteOffer({teamLeaderId: userId, name: offerName});
await ctx.deleteMessage();
});

bot.hears('📲 Мой чат 📲', async (ctx) => {
   try {
       const userId = ctx.update.message.from.id;
       console.log(userId)
       if (!(await isTeamLeader({userId}))) {
           return await ctx.reply('🚫 Отказано в доступе! 🚫');
       }
       if (!(await hasTeamChat(userId))) {
           return await ctx.scene.enter('addTeamChatWizard')
       }
       const currentTeamChat = await getTeamChat({teamLeaderId: userId});
       return await ctx.replyWithHTML(`🔗 <b>Ссылка на ваш чат:</b> ${currentTeamChat.inviteLink}`, teamLeaderKeyboard);
   } catch(error) {
       console.log(error.message);
   }

});

bot.action('accept_work', async (ctx) => {
    const parsedMessage  = ctx.update.callback_query.message.text.split('\n')
        .join().split(': ');

    const {chat: {id: chatId}, message_id} = ctx.update.callback_query.message;
    await ctx.deleteMessage();

    const userId = parsedMessage[2];

    const teamLeaderId = ctx.update.callback_query.message.chat.id;
    const teamLeaderUsername = ctx.update.callback_query.message.chat.username;
    const currentTeamChat = await getTeamChat({teamLeaderId});

    await addWorker({userId, teamLeaderId});
    await ctx.telegram.sendMessage(userId, '✅ Ваша анкета рассмотрена и одобрена ✅ ');
    await ctx.telegram.sendMessage(userId, `✅ Ваш руководитель: @${teamLeaderUsername}\nСсылка на рабочий чат: ${currentTeamChat?.inviteLink || 'Отсутствует'}`, workerKeyboard);
});

bot.action('decline_work', ctx => {
    const parsedMessage  = ctx.update.callback_query.message.text.split('\n')
        .join().split(': ');

    const userId = parsedMessage[2];

    const {chat: {id: chatId}, message_id} = ctx.update.callback_query.message;
    ctx.telegram.deleteMessage(chatId, message_id);
    ctx.telegram.sendMessage(userId, '🚫 Мы не можем вас нанять на работу. Всего хорошего! 🚫');
})

bot.action('create_payment', async (ctx) => {
    try {
       const paymentInfo = ctx.update.callback_query.message.text;
       const workerId = paymentInfo.replace('🔔 Запрос на выплату', '').split('\n').join().split(': ')[1].match(/\d/g).join('');
       ctx.deleteMessage();
       await ctx.telegram.sendMessage(workerId, '✅ <b>Выплата была произведена</b> ✅', {parse_mode: "HTML"});
       await resetBalance(workerId);
    } catch(error) {
        console.log(error.message);
    }
});

bot.action('decline_payment', ctx => ctx.deleteMessage());

bot.hears('📈 Статистика проекта 📈', async (ctx) => {
     const workersCount = (await getAllWorkers()).length;
     const teamLeadersCount = (await getAllTeamLeaders()).length;
     return await ctx.replyWithHTML(`🥷 Тимлидеров: ${workersCount}\n👨‍💻 Сотрудников: ${teamLeadersCount}`);
});

bot.hears('📈 Cтатистика 📈', async (ctx) => {
    const {id: userId, username} = ctx.update.message.from;

    if(!(await isTeamLeader({userId}))) {
        return await ctx.reply('🚫 Отказано в доступе! 🚫');
    }


    const myWorkers = await getWorkers({teamLeaderId: userId});
    const allProfit = myWorkers.reduce((sum, worker) => sum + worker.balance, 0);
    const allHoldSum = myWorkers.reduce((sum, worker) => sum + worker.hold, 0);
    return await ctx.replyWithHTML(`🆔 <b>ID:</b> <code>${userId}</code>\n👥 <b>Количество сотрудников:</b> ${myWorkers.length}\n💰 <b>Общий баланс работников:</b> ${allProfit}₽\n🕓 <b>Баланс работников в ожидании:</b> ${allHoldSum}₽`);
});


bot.hears('🔗 Ссылка-приглашение 🔗', async(ctx) => {
    const userName = ctx.update.message.from.username;
    if (!userName) {
        return ctx.reply('У вас не задан ник пользователя!');
    }
    await ctx.replyWithHTML(`🔗 Пригласительная ссылка: \n <code>https://t.me/jews_wallet_bot?start=${userName}</code>`);
})

bot.on('chat_join_request', async (ctx) => {
    const joinRequest = ctx.update.chat_join_request;
    const {invite_link: {creator: {id: teamLeaderId}}, from: {id: userId}, chat: {id: chatId} } = joinRequest;

    if (await isWorker(userId)) {
        const currentWorker = await getWorker(userId);
        if (currentWorker.teamLeaderId == teamLeaderId) {
            await ctx.approveChatJoinRequest(userId, chatId);
        }
    }
});

bot.on('new_chat_members', async (ctx) => {
    const userId = ctx.update.message.from.id;
    const chatId = ctx.update.message.chat.id;
    try {
        if(!(await isWorker(userId))) {
           return await ctx.banChatMember(chatId, userId);
        }
    } catch(error) {
        console.log(error.message);
    }
})

bot.command('menu', async (ctx) => {
    const userId = ctx.update.message.from.id;
    console.log(userId);
    if(await isTeamLeader({userId})) {
        return ctx.reply('🥷 Привет, TeamLeader! 🥷', teamLeaderKeyboard);
    }

    if(await isWorker(userId))  {
        return ctx.reply('👔 Worker панель 👔', workerKeyboard);
    }
});

bot.on('text', async(ctx) => {
   const message = ctx.update.message.text;

   const userId = ctx.update.message.from.id;
   const chatId = ctx.update.message.chat.id;
   if (userId != chatId) {
       if (! (await isTeamLeader({userId}))) {
           return;
       }
       if (message.startsWith('https://t.me/')) {
           const foundTeamChat = await getTeamChat({teamLeaderId: userId});
           console.log(foundTeamChat);
           if (!foundTeamChat) {
               return;
           }
           if (foundTeamChat.chatId) {
               return;
           }
           foundTeamChat.chatId = chatId;
           await foundTeamChat.save();
           await ctx.reply('Сохранено!');
       }
   }
});

const startServer = () => server.listen(process.env.PORT || 5000);

const connectToDatabase = async () => {
    try {
        console.log('Connected to database');
        mongoose.connect(databaseURL);

    } catch(error) {
        console.log(error.message);
        mongoose.connect(databaseURL);
    }
};

const startBot = async () => {
   try {
       await bot.launch();
   } catch(error) {
       console.log(error.message);
       await startBot();
   }
};
startServer();
connectToDatabase();
startBot();
