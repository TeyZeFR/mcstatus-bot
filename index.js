const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const CHANNEL_ID = process.env.CHANNEL_ID;
const MC_URL = 'https://api.mcstatus.io/v2/status/java/109.239.154.30:26065';

async function updateStatus() {
  try {
    const res = await fetch(MC_URL);
    const data = await res.json();
    const isOnline = data.online;

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return console.log('Salon introuvable');

    const newName = `Statut : ${isOnline ? '🟢' : '🔴'}`;
    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`Salon mis à jour : ${newName}`);
    }
  } catch (e) {
    console.error('Erreur :', e.message);
  }
}

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  updateStatus();
  setInterval(updateStatus, 60000);
});

client.login(process.env.DISCORD_TOKEN);
