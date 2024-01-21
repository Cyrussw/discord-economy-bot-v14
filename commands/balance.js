const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Show a user their balance!"),
    async execute(interaction, profile_data) {
        const { balance } = profile_data;
        const username = interaction.user.username;


        await interaction.reply(`${username} has ${balance} coins`);
    },
};