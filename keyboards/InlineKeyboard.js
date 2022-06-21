const {Markup} = require('telegraf');

class InlineKeyboard {
    constructor() {
        this.buttons = [];
    }
    add (text, query) {
        this.buttons.push([Markup.button.callback(text, query)]);
        return this;
    }
    get keyboard() {
        return Markup.inlineKeyboard(this.buttons);
    }
}

module.exports = InlineKeyboard;
