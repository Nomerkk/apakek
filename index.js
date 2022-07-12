const Discord = require('discord.js-selfbot-v13');
require('dotenv').config()
const client = new Discord.Client({checkUpdate:false, ws: { properties: { $browser: "Discord iOS" }}})
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //Client Events
client.on("ready", async () => {
      console.log(`✅ ${client.user.username} Summoned`);
      client.user.setPresence({status: 'online'});
      const {joinVoiceChannel} = require('@discordjs/voice');
      const channel = client.channels.cache.get("996323526837542942"); // voice channel's id
      if (!channel) return console.log("The channel does not exist!");
      setInterval(() => {
              const connection = joinVoiceChannel({
                  channelId: channel.id, // the voice channel's id
                  guildId: channel.guild.id, // the guild that the channel is in
                  adapterCreator: channel.guild.voiceAdapterCreator, // and setting the voice adapter creator
                  selfDeaf: false,
                  selfMute: true,
              });
            }, 600)
          });
require("./uptime.js")();
client.login(process.env.TOKEN)

