const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");
const moment = require("moment");

module.exports = {
  async checkDatabase() {
    var users = new Array();
    for await (const [key, value] of keyv.iterator()) {
      const valueDate = moment(value, "M/D/YYYY");
      if (valueDate.dayOfYear() == moment().dayOfYear()) {
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
