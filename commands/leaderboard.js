const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const profile_model = require('../models/profile_schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows Top 10 Coin Earners"),
    async execute(interaction, profile_data) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { balance } = profile_data;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("**Top 10 Coin Earners**")
            .setColor(0x45d6f)
            .setFooter({ text: "You are not ranked yet" });

        const members = await profile_model.find().sort({ balance: -1 }).catch((err) => console.log(err))

        const memberIdx = members.findIndex((member) => member.userId === id)

        leaderboardEmbed.setFooter({ text: `${username}, you're rank #${memberIdx + 1} with ${balance}`, });

        const topTen = members.slice(0, 10);

        let desc = "";

        for (let i = 0; i < topTen.length; i++) {
            let { user } = await interaction.guild.members.fetch(topTen[i].userId);

            if (!user) return;

            let user_balance = topTen[i].balance;

            desc += `**${i + 1}. ${user.username}** ${user_balance} Coins\n`;
        }
        
        if (desc !== "") {
            leaderboardEmbed.setDescription(desc);
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });

    },
};