const { SlashCommandBuilder } = require("discord.js");
const Keyv = require("keyv");
const keyv = new Keyv("sqlite://database//birthdays.sqlite");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-birthday")
    .setDescription("Delete birthday from database.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to delete")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (await keyv.delete(user.id)) {
      interaction.reply(`${user.username}'s birthday deleted`);
    } else {
      interaction.reply("User does not exist in database");
    }
  },
};
