const Discord = require('discord.js-selfbot-v13');
const request = require("request");
const config = require("./config.json");
const STATUS_URL = "https://discordapp.com/api/v8/users/@me/settings";
require('dotenv').config()
const client = new Discord.Client({
  checkUpdate: false,
    ws: {
        properties: {
            browser: 'Discord iOS',
        },
    },
})
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //Client Events
client.on("ready", async () => {
      console.log(`✅ ${client.user.username} Summoned`);
      client.user.setPresence({status: 'idle'});
      const {joinVoiceChannel} = require('@discordjs/voice');
      const channel = client.channels.cache.get("1158580792994304100"); // voice channel's id
      if (!channel) return console.log("The channel does not exist!");
      setInterval(() => {
              const connection = joinVoiceChannel({
                  channelId: channel.id, // the voice channel's id
                  guildId: channel.guild.id, // the guild that the channel is in
                  adapterCreator: channel.guild.voiceAdapterCreator, // and setting the voice adapter creator
                  selfDeaf: false,
                  selfMute: true,
              });
            }, 6000)
          });
async function loop() {
            for (let anim of config.animation) {
              await doRequest(anim.text, anim.emojiID, anim.emojiName).catch(console.error);
              await new Promise(p => setTimeout(p, anim.timeout));
            }
          
            loop();
          }
          console.log("Discord Status Changer is Running...");
          loop();
          function doRequest(text, emojiID = null, emojiName = null) {
            return new Promise((resolve, reject) => {
              request({
                method: "PATCH",
                uri: STATUS_URL,
                headers: {
                  Authorization: process.env.TOKEN
                },
                json: {
                  custom_status: {
                    text: text,
                    emoji_id: emojiID,
                    emoji_name: emojiName
                  }
                }
              }, (err, res, body) => {
                if (err) {
                  reject(err);
                  return;
                }
          
                if (res.statusCode !== 200) {
                  reject(new Error("Invalid Status Code: " + res.statusCode));
                  return;
                }
          
                resolve(true);
              });
            });
          }

client.login(process.env.TOKEN)
