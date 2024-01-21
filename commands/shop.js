const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop Menu"),
    async execute(interaction) {
        await interaction.deferReply();

        let shop_menu = new EmbedBuilder()
            .setAuthor({
                name: "Shop",
            })
            .setTitle("Sai Gifts Shop")
            .setDescription("Welcome to the market! Here you can make purchases using your coins.\n\n**Categories**\n\n> Social\n> Server\n> Other\n\n**Social**\n\n> Spotify - 500 SaiCoins\n> Netflix - 2000 SaiCoins\n> YouTube - 2000 SaiCoins\n\n**Server**\n\n> Private Channels - 500 SaiCoins\n> NSFW Archives - 750 SaiCoins\n> Hacking Tools - 1000 SaiCoins")
            .setColor("#00b0f4")
            .setFooter({
                text: "SaiGifts!",
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [shop_menu] });
    },
};