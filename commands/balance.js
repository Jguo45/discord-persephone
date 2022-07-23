const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require('../db')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance'),
  async execute(interaction) {
    const user = interaction.user
    const res = await db.query(
      `SELECT coin.ownerId FROM coin WHERE coin.ownerId = $1`,
      [user.id]
    )
    console.log(res)
    if (res.rowCount === 1) {
      const resBal = await db.query(
        `SELECT coin.amount FROM coin WHERE coin.ownerId = $1`,
        [user.id]
      )
      const balance = resBal.rows[0].amount
      await interaction.reply(`Current balance: ${balance} fg sheckels`)
    } else {
      await interaction.reply('You do not have an account')
    }
  },
}
