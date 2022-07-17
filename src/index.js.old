const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("better-sqlite3");
const path = require("path");
const https = require('https');
const fs = require("fs");
require("dotenv").config();

const queries = require("../src/db-queries");
const db = new Database(path.resolve("data/mailbox.db"));
const mailboxDir = "./data/mailbox.txt";

const PREFIX = "!";
const adminID = process.env.ADMINID.split(" ");
const cooldowns = new Discord.Collection();

// Login
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("for messages! | !help", { type: "WATCHING" });
  queries.createTable(db);
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnected!");
});

// restricted bot commands
client.on("message", (msg) => {
  if (
    !msg.content.startsWith(PREFIX) ||
    !(msg.channel instanceof Discord.DMChannel) ||
    !adminID.includes(msg.author.id) ||
    msg.author.bot
  )
    return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // opens the mailbox to see messages
  if (commandName === "open") {
    msg.channel.send({ files: [mailboxDir] });
  }

  // clears the mailbox
  else if (commandName === "clear") {
    fs.writeFileSync(mailboxDir, "");

    console.log("Cleared Table");
    msg.channel.send("Cleared Table");
  }

  // sets the mailbox to txt file sent to bot
  else if (commandName === 'set') {
    let filter = (m) => m.author.id === msg.author.id && m.channel instanceof Discord.DMChannel;
    const collector = msg.channel.createMessageCollector(filter, {
      max: 1,
    });

    msg.channel.send('Send file:');
    collector.on('collect', (m) => {
      let url = m.attachments.first().url;
      const file = fs.createWriteStream(mailboxDir);
      const request = https.get(url, (response) => {
        response.pipe(file);
        msg.channel.send('File recieved successfully');
        console.log('Mailbox set');
      });
    });

  } 
});

// unrestricted bot commands
client.on('message', (msg) => {
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'help') {
    msg.channel.send(`Hello there ${msg.author.username}!\nThis bot is very bare bones at the moment. Currently it can only take messages you send it and stores them! Iris wanted this to be a suggestion box of sorts for the server but feel free to send it whatever you want! If you have suggestions for the bot as well, send them here too!\n(As of now any message starting with '!' is reserved for commands only but this may be subject to change)`);
  }
});

// stores any dm to the bot that doesn't start with '!' as a message
client.on("message", (msg) => {
  if (
    msg.author.bot ||
    msg.content.startsWith(PREFIX) ||
    msg.attachments.size > 0 || 
    !(msg.channel instanceof Discord.DMChannel)
  )
    return;

  console.log(`Collected ${msg.content}`);

  // writes the message into a text file
  fs.appendFileSync(
    mailboxDir,
    `${msg.author.username} : ${msg.content}\n`,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );

  if (msg.content === "pee") {
    msg.channel.send("bro wtf why?");
  } else {
    msg.channel.send("Thank you for your message!");
  }
});

client.login(process.env.CLIENT_ID);
