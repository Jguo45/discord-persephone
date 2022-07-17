const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update-commands')
    .setDescription('Updates all the commands for each server'),
  async execute(interaction) {
    console.log(interaction)
    const guildID = interaction.guildId

    const commands = []
    const commandsPath = path.join(__dirname, '../commands')
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath)
      commands.push(command.data.toJSON())
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
        body: commands,
      })
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error)
    await interaction.reply('Commands registered.')
  },
}
