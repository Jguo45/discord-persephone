const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, ChannelType, PermissionsBitField } = require("discord.js");
const Keyv = require("keyv");
require("dotenv").config();
const { checkDatabase } = require('../util/birthdayUtil')
const moment = require('moment')

const keyv = new Keyv("sqlite://database//birthdays.sqlite");
keyv.on("error", (err) => console.log("Connection Error", err));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, "..", "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  var channelExists = false;

  // TODO: change to actual server
  const counterGuild = await client.guilds.fetch(process.env.TRIP_GUILD_ID)
  var channelID = ''
  for (const ch of counterGuild.channels.cache) {
    if (
      ch[1].type === ChannelType.GuildVoice &&
      ch[1].name.startsWith('Days till Cabin Trip:')
    ) {
      channelID = ch[0]
      channelExists = true;
    }
  }
  if(!channelExists) {
    const channel = await counterGuild.channels.create({
      name: "Days till Cabin Trip: 0",
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.Connect]
        },
      ]
    })
    channelID = channel.id
  }

  var interval = 1
  const channel = counterGuild.channels.cache.get(channelID)
  const eventDate = moment('8/7/2023', 'M/D/YYYY')

  // TODO: change to actual server
  const birthdayGuild = await client.guilds.fetch(process.env.MAIN_GUILD_ID)
  // TODO: update birthday role id
  const roleID = process.env.ROLE_ID
  const birthdayRole = await birthdayGuild.roles.fetch(roleID)
  await birthdayRole.setPosition(0)

  const updateEvent = async () => {
    console.log(`${moment().toString()}: Checking events...`)

    const diff = eventDate.diff(moment(), 'days') + 1
    const days = parseInt(channel.name.split(': ')[1])
    if (days - diff !== 0) {
      counterGuild.channels.edit(channelID, {
        name: `Days till Cabin Trip: ${diff}`,
      })
      console.log(`Countdown updated: ${days} -> ${diff}`)
    }
    const nextDay = moment().add(1, 'days').startOf('day')
    const nextUpdate = nextDay.diff(moment(), 'minutes') + 1
    interval = nextUpdate

    // Birthday section
    console.log(`${moment().toString()}: Checking birthdays...`)
    const users = await checkDatabase()

    // clears out birthday role
    birthdayRole.members.each(user => {
      user.roles.remove(birthdayRole)
      console.log(`Removed ${birthdayRole.name} role from ${user.user.username}`)
    })

    if(users.length > 0) {
      msg = `@everyone WISH A HAPPY <@&${roleID}> TO:\n`

      for(const userID of users) {
        const user = await birthdayGuild.members.fetch(userID)
        // give users birthday role
        user.roles.add(birthdayRole)
        msg += `${user}\n`
      }
      // TODO: change from test channel to actual channel
      const msgChannel = await birthdayGuild.channels.fetch(process.env.MAIN_GUILD_ID)
      msgChannel.send(msg)
    }

    console.log(
      `Next update at ${moment().add(interval, 'minutes').toString()}`
    )

    setTimeout(updateEvent, interval * 60 * 1000)
  }

  updateEvent()
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
