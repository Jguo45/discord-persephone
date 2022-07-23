const { SlashCommandBuilder } = require('@discordjs/builders')
const { User } = require('../src/db-objects.js')
const db = require('../db')
// const { Op } = require('sequelize')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register-user')
    .setDescription('Creates a fg coin account'),
  async execute(interaction) {
    const user = interaction.user
    // console.log(interaction)
    const userExists = await User.findOne({
      where: {
        user_id: user.id,
      },
    })
    console.log(userExists)
    await interaction.reply('hello')
  },
  // async execute(interaction) {
  //   const user = interaction.user
  //   const res = await db.query(
  //     `SELECT coin.ownerId FROM coin WHERE coin.ownerId = $1`,
  //     [1]
  //   )
  //   if (res.rowCount === 0) {
  //     await db.query(
  //       `INSERT INTO coin(ownerId, ownerName, amount) VALUES($1, $2, $3)`,
  //       [user.id, user.username, 0]
  //     )
  //     await interaction.reply('Account created!')
  //   } else {
  //     await interaction.reply('Account already exists')
  //   }
  // },
}
