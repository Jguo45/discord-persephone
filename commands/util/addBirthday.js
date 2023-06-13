const { SlashCommandBuilder } = require("discord.js");
const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");
const moment = require('moment')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-birthday")
    .setDescription("Adds birthday to database.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user with this birthday").setRequired(true)
    )
    .addStringOption((option) =>
        option.setName('date').setDescription('The date(mm/dd/yyyy) of the birthday.').setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const date = interaction.options.getString('date');

    if(moment(date, "M/DD/YYYY", true).isValid()) {
      await keyv.set(user.id, date);
      await interaction.reply("Birthday added!")
    }
    else {
      await interaction.reply("Invalid date!")
    }
  },
};
