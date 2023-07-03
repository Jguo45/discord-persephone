const { SlashCommandBuilder } = require("discord.js");
const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-birthday")
    .setDescription("Adds birthday to database.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user with this birthday")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date(mm/dd) of the birthday.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const date = interaction.options.getString("date");

    if (moment(date, "M/D", true).isValid()) {
      console.log(`Birthday added: ${user.username}`);
      await keyv.set(user.id, date);
      await interaction.reply("Birthday added!");
    } else {
      await interaction.reply("Invalid date!");
    }
  },
};
