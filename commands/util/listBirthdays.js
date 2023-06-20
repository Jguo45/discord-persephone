const { SlashCommandBuilder } = require("discord.js");
const Keyv = require("keyv");
const { listBirthdays } = require("../../util/birthdayUtil");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-birthdays")
    .setDescription("Lists all birthdays in the database."),
  async execute(interaction) {
    const birthdays = await listBirthdays()

    if(birthdays.size == 0) {
      await interaction.reply('No birthdays in the database. :(')
    }
    else {
      const members = await interaction.member.guild.members
      var msg = 'Birthdays: \n'
      for(const [key, value] of birthdays) {
        const member = await members.fetch(key)
        msg += `${member.user.username} : ${value}`
      }
      await interaction.reply(msg)
    }
  },
};
