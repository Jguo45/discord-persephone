require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const moment = require('moment-timezone')
const { Op } = require('sequelize')
const { Users } = require('./db-objects.js')

const { Client, Collection, Intents } = require('discord.js')
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['CHANNEL'],
})

const mailboxDir = './data/mailbox.txt'
moment.tz.setDefault('America/New_York')

const currency = new Collection()

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

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  // try {
  //   await sequelize.authenticate()
  //   console.log('Connection established successfully')
  // } catch (err) {
  //   console.error('Unable to connect to the database:', err)
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
      console.log(`Countdown updated: ${days} -> ${diff}`)
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

client.once('reconnecting', () => {
  console.log('Reconnecting!')
})

client.once('disconnect', () => {
  console.log('Disconnected!')
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

client.on('messageCreate', async (msg) => {
  if (msg.author.bot || msg.guildId) return

  console.log(msg)
  console.log(msg.channel)

  console.log(`Message collected: ${msg.content}`)

  fs.appendFileSync(
    mailboxDir,
    `${msg.author.username}#${msg.author.discriminator} : ${msg.content}\n`,
    (err) => {
      if (err) {
        console.error(err)
        return
      }
    }
  )
  await msg.channel.send('Thanks for the message')
})

client.on('guildCreate', (guild) => {
  deployCommands(guild.id)
})

client.login(process.env.TOKEN)

const deployCommands = (guildID) => {
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)

  rest
    .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
      body: commands,
    })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}
