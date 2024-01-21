require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

const { DISCORD_TOKEN: token, MONGODB_SRV: database } = process.env;

const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

const events_path = path.join(__dirname, "events");
const event_files = fs.readdirSync(events_path).filter((file) => file.endsWith('.js'));

for (const file of event_files) {
    const file_path = path.join(events_path, file);
    const event = require(file_path);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();

const commands_path = path.join(__dirname, "commands");
const command_files = fs.readdirSync(commands_path).filter((file) => file.endsWith('.js'));

for (const file of command_files) {
    const file_path = path.join(commands_path, file);
    const command = require(file_path);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[UYARI]: Bu komut içerisinde '${file_path}' gereken 'data' ve 'execute' eksik!`);
    }
}

mongoose.connect(database)
    .then(() => {
        console.log("[MONGOOSE]: Bağlantı başarılı!");
    })
    .catch((err) => {
        console.error("[MONGOOSE]:", err);
    });

client.login(token);