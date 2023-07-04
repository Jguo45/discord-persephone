const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");
const moment = require("moment-timezone");

moment.tz.setDefault("America/New_York");

module.exports = {
  async checkDatabase(guild) {
    var users = new Array();
    var msg = "";
    for await (const [key, value] of keyv.iterator()) {
      const valueDate = moment(value, "M/D");
      if (valueDate.dayOfYear() == moment().dayOfYear()) {
        users.push(key);

        const u = await guild.members.fetch(key);
        msg += `${u.user.username}, `;
      }
    }
    console.log(`Birthdays today: ${msg}`);
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
