const {Markup} = require('telegraf');

class Keyboard {
    constructor() {
        this.buttons = [];
    }
    add (text) {
        this.buttons.push([text]);
        return this;
    }
    get keyboard() {
        return Markup.keyboard(this.buttons);
    }
}

module.exports = Keyboard;
