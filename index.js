const Discord = require('discord.js-selfbot-v13');
const axios = require('axios');
const config = require('./config.json');
require('dotenv').config();

const STATUS_URL = "https://discordapp.com/api/v8/users/@me/settings";
const client = new Discord.Client({
  checkUpdate: false,
  ws: { properties: { browser: 'Discord iOS' } }
});

// Client Events
client.on("ready", async () => {
  console.log(`✅ ${client.user.username} Summoned`);
  client.user.setPresence({ status: 'idle' });

  const { joinVoiceChannel } = require('@discordjs/voice');
  const channel = client.channels.cache.get("115543743051047324");
  if (!channel) return console.log("The channel does not exist!");

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: false
  });
  
  console.log("Connected to voice channel");
});

// Loop function to change Discord status
async function loop() {
  for (let anim of config.animation) {
    try {
      await doRequest(anim.text, anim.emojiID, anim.emojiName);
      await new Promise(p => setTimeout(p, anim.timeout));
    } catch (error) {
      console.error(error);
    }
  }
  setTimeout(loop, 1000); // Avoid stack overflow by not using recursion
}

// Send request to change status
async function doRequest(text, emojiID = null, emojiName = null) {
  try {
    const response = await axios.patch(STATUS_URL, {
      custom_status: {
        text,
        emoji_id: emojiID,
        emoji_name: emojiName
      }
    }, {
      headers: {
        Authorization: process.env.TOKEN
      }
    });

    if (response.status !== 200) {
      throw new Error("Invalid Status Code: " + response.status);
    }
  } catch (error) {
    throw error;
  }
}

console.log("Discord Status Changer is Running...");
client.login(process.env.TOKEN);
loop();
