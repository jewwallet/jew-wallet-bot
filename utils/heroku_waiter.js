const axios = require('axios').default;

// Этот скрипт создан для того, чтобы Heroku не завершал процесс работы бота.

setInterval(() => {
   axios.get('https://jsonplaceholder.typicode.com/todos/1')
       .then(response => console.log(response.data));
}, 2000);