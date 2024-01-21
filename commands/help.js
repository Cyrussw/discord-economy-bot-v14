const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Commands Menu!"),
    async execute(interaction) {
        await interaction.deferReply();

        let help_menu = new EmbedBuilder()
            .setAuthor({
                name: "Help",
            })
            .setTitle("Sai Gifts - Help")
            .setDescription("**Welcome to the Help menu, where you can find my commands!**")
            .addFields(
                {
                    name: "/daily",
                    value: "Reedem free coins every day!",
                    inline: true
                },
                {
                    name: "/balance",
                    value: "Show a user their balance!",
                    inline: true
                },
                {
                    name: "/donate",
                    value: "Donate your coins to another user!",
                    inline: true
                },
                {
                    name: "/leaderboard",
                    value: "Shows Top 10 Coin Earners",
                    inline: true
                },
                {
                    name: "/shop",
                    value: "You can see the products",
                    inline: true
                },
                {
                    name: "/coinflip",
                    value: "Flip a coin for a free bonus",
                    inline: true
                },
            )
            .setColor("#00b0f4")
            .setFooter({
                text: "SaiGifts!",
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [help_menu] });
    },
};