require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

const { CLIENT_ID: client_id, GUILD_ID: guild_id, DISCORD_TOKEN: token } = process.env;

const commands = [];
const command_files = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of command_files) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`${commands.length} commands are being refreshed!`);

        await rest.put(
            Routes.applicationGuildCommands(client_id, guild_id),
            { body: commands },
        );

        console.log(`${commands.length} commands have been successfully refreshed!`);
    } catch (error) {
        console.error(error);
    }
})();
