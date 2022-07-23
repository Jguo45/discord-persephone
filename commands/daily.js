const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require('../db')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Free shekels every 24 hours'),
  async execute(interaction) {
    const dailyAmount = 20
    const user = interaction.user

    console.log(interaction)

    await interaction.reply('testest')
  },
}
