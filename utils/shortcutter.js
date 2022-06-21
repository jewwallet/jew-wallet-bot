const axios = require('axios').default;

const shortcutServiceLink = 'https://jew-wallet-cc.herokuapp.com/links/createLink';

async function cutUrl(url) {
    try {
        const response = await axios.post(shortcutServiceLink, {
            original: url,
        }, {
            'Content-Type': 'application/json',
        });
        return 'https://jew-wallet-cc.herokuapp.com/' + response.data.shortCut;
    } catch(error) {
        console.log(error.message);
    }
}

module.exports = cutUrl;
