require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const { Client, Collection, Intents } = require('discord.js')
const moment = require('moment')
moment.tz.setDefault('America/New_York')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const commands = []
client.commands = new Collection()
const commandsPath = path.join(__dirname, '../commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  commands.push(command.data.toJSON())
  client.commands.set(command.data.name, command)
}

const deployCommands = (guildID) => {
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

  rest
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
      body: commands,
    })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // for (const guild of client.guilds.cache) {
  //   if (guild[1].name === 'Test') {
  //     console.log(guild[1].id)
  //   }
  // }
  const guild = client.guilds.cache.get('937910529794654232')
  var channelID = ''
  for (const ch of guild.channels.cache) {
    if (
      ch[1].type === 'GUILD_VOICE' &&
      ch[1].name.startsWith('Days till Cabin Trip:')
    ) {
      channelID = ch[0]
    }
  }

  var interval = 1
  const channel = guild.channels.cache.get(channelID)
  const eventDate = moment('8/8/2022', 'MM/DD/YYYY')

  const update = () => {
    const diff = eventDate.diff(moment(), 'days') + 1
    const days = parseInt(channel.name.split(': ')[1])
    if (days - diff !== 0) {
      guild.channels.edit(channelID, {
        name: `Days till Cabin Trip: ${diff}`,
      })
      console.log('Countdown updated')
    }
    const nextDay = moment().add(1, 'days').startOf('day')
    const nextUpdate = nextDay.diff(moment(), 'minutes') + 1
    interval = nextUpdate

    console.log(
      `Next update at ${moment().add(interval, 'minutes').toString()}`
    )

    setTimeout(update, interval * 60 * 1000)
  }
  update()
  // setTimeout(update, interval)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply({
      content: 'There was an error while executing that command',
      ephemeral: true,
    })
  }
})

client.on('guildCreate', (guild) => {
  deployCommands(guild.id)
})

client.login(process.env.TOKEN)
