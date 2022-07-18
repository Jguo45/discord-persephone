const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const moment = require('moment-timezone')

moment.tz.setDefault('America/New_York')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start-countdown')
    .setDescription('Starts the countdown.'),
  async execute(interaction) {
    const guild = interaction.guild
    for (const channel of guild.channels.cache) {
      const name = channel[1].name
      if (name.startsWith('Days till Cabin Trip:')) {
        return await interaction.reply('Countdown has already started!')
      }
    }
    const eventDate = new moment('8/8/2022', 'MM/DD/YYYY')
    const diff = eventDate.diff(moment(), 'days')

    const channel = await guild.channels.create(
      `Days till Cabin Trip: ${diff}`,
      {
        type: 'GUILD_VOICE',
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [Permissions.FLAGS.CONNECT],
          },
        ],
      }
    )
    await guild.channels.setPosition(channel.id, 0)
    await interaction.reply('Countdown started!')
  },
}
