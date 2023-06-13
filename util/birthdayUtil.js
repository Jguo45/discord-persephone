const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");
const moment = require("moment");

module.exports = {
  async checkDatabase() {
    var users = new Array();
    for await (const [key, value] of keyv.iterator()) {
      console.log(key, value);
      const valueDate = moment(value, "M/DD/YYYY");
      if (
        valueDate.month === moment().month &&
        valueDate.day === moment().day
      ) {
        users.push(key);
      }
    }
    return users;
  },

  async listBirthdays() {
    const birthdayMap = new Map();

    for await (const [key, value] of keyv.iterator()) {
      birthdayMap.set(key, value);
    }

    return birthdayMap;
  },
};
