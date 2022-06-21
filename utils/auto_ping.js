const ping = require('ping');

setInterval(() => {
    ping.sys.probe('127.0.0.1', isAlive => console.log(`[isAlive] = ${isAlive}`));
}, 5000);