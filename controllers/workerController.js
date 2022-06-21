const Worker = require('../models/Worker.js');

module.exports = {
  async addWorker({teamLeaderId, userId}) {
        try {
            const newWorker = new Worker({teamLeaderId, userId});
            await newWorker.save();
        } catch(error) {
            console.log(error.message);
        }
  },

  async isWorker(userId) {
      try {
          const findedWorker = (await Worker.find({userId}))[0];
          return !!findedWorker;
      } catch(error) {
        console.log(error.message);
      }
  },
    async getWorker(userId) {
        try {
            const findedWorker = (await Worker.find({userId}))[0];
            return findedWorker;
        } catch(error) {
            console.log(error.message);
        }
    },
    async getWorkers({teamLeaderId, userId}) {
          if (!userId) {
              return (await Worker.find({teamLeaderId}));
          }
          if (!teamLeaderId) {
              return (await Worker.find({userId}));
          }
    },
    async addBalance({userId, balance}) {
        try {
            const currentWorker = (await Worker.find({userId}))[0];
            currentWorker.hold -= (+balance);
            currentWorker.balance += (+balance);
            await currentWorker.save();
        } catch(error) {
            console.log(error.message);
        }
    },
    async addHold({userId, hold}) {
        try {
            const currentWorker = (await Worker.find({userId}))[0];
            currentWorker.hold += (+hold);
            await currentWorker.save();
        } catch(error) {
            console.log(error.message);
        }
    },
    async resetBalance(userId) {
      try {
          const currentWorker = (await Worker.find({userId}))[0];
          currentWorker.balance = 0;
          await currentWorker.save();
      } catch(error) {
          console.log(error.message);
      }
    },
    async minusHold({userId, hold}) {
        try {
            const currentWorker = (await Worker.find({userId}))[0];
            currentWorker.hold -= (+hold);
            await currentWorker.save();
        } catch(error) {
            console.log(error.message);
        }
    },
    async getAllWorkers() {
      return (await Worker.find());
    }
};
