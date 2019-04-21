process.env.NTBA_FIX_319 = 1
const mongodbClient = require('./mongodb')
const TelegramBot = require('node-telegram-bot-api');
const qr = require('qr-image');
const fetch = require('node-fetch');

const token = '570410919:AAFT8ng9SB1Nz-nZp_c2b_U3WMM_V3YFEe0';

const bot = new TelegramBot(token, {polling: true});

require('https').createServer().listen(process.env.PORT || 5001).on('request', function(req, res){
    res.end('')
});

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, 'Create balance', {
        reply_markup: {
            inline_keyboard : [[
            {
                text: 'Add 5',
                callback_data: 'add 5'
            },{
                text: 'Add 10',
                callback_data: 'add 10'
            },{
                text: 'Add 15',
                callback_data: 'add 15'
            },{
                text: 'Minus 5',
                callback_data: 'minus 5'
            }
        ]]
        }
    });
});

bot.on('callback_query', async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;
    const [type, count] = data.split(' ')
    console.log(type, count);
    let qrCode = await mongodbClient.addQrCode(type === 'minus' ? `-${count}` : count, msg.from);
    console.log(qrCode);
    var qr_svg = qr.imageSync(`${qrCode.id}`, { type: 'png' });
    bot.sendPhoto(chatId, qr_svg);
    bot.sendMessage(chatId, `You ${msg.data} coin`);
});