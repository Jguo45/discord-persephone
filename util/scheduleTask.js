const CronJob = require("cron").CronJob;
const { checkDatabase } = require("./birthdayUtil");

const job = new CronJob("1 0 * * *", function () {
  const now = moment().format("MM/DD/YYYY");
  const birthdays = checkDatabase(now);
});
