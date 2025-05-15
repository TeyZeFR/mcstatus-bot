const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const API_URL = 'https://api.mcstatus.io/v2/status/java/109.239.154.30:26065';

async function updateCategoryName() {
  try {
    const response = await axios.get(API_URL);
    const isOnline = response.data.online;

    const statusEmoji = isOnline ? '🟢' : '🔴';
    const name = `『🎮』Statut serveur : ${statusEmoji}`;

    const category = await client.channels.fetch(process.env.CHANNEL_ID);
    if (category && category.type === 4) {
      await category.setName(name);
      console.log(`[✓] Catégorie mise à jour : ${name}`);
    } else {
      console.error('[X] Le channel spécifié n’est pas une catégorie.');
    }
  } catch (err) {
    console.error('[X] Erreur lors de la requête ou mise à jour :', err.message);
  }
}

client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  updateCategoryName();
  setInterval(updateCategoryName, 2 * 60 * 1000); // toutes les 2 minutes
});

client.login(process.env.DISCORD_TOKEN);

