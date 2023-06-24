const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const set = require(`${process.cwd()}/Assets/Config/settings`);
require("dotenv").config()
require(`colors`)
const client = new Client({
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});



[`variables`, `extraEvents`,`checker`, `mongo_db`, `server`, 'slashCommand', 'events', `antiCrash`].forEach((handler) => {
  const file = require(`./src/handlers/${handler}`)
  if (file.execute) file.execute(client);
  else file(client);
});

client.login(process.env.TOKEN).catch((error) => { console.log((error.message).bold.red) });


module.exports = client;

// auto kill 
setInterval(() => {
  if (set.REPL_SETTINGS.AUTO_KILL && set.REPL_USER) {
    if (!client || !client.user) {
      client.logger("Rate limit assumed, restarting")
      process.kill(1)
    }
  }
}, 5000)
