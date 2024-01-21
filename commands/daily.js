const { SlashCommandBuilder } = require('discord.js');
const parsems = require('parse-ms-2');
const profile_model = require('../models/profile_schema');
const { dailyMin, dailyMax } = require('../global_values.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Reedem free coins every day!"),
    async execute(interaction, profile_data) {
        const { id } = interaction.user;
        const { dailyLastUsed } = profile_data;

        const cooldown = 86400000;
        const time_left = cooldown - (Date.now() - dailyLastUsed);

        if (time_left > 0) {
            await interaction.deferReply({
                ephemeral: true
            });

            const { hours, minutes, seconds } = parsems(time_left);

            return interaction.editReply(`Claim your next daily in ${hours} hrs ${minutes} min ${seconds} sec`);
        }
        
        await interaction.deferReply();

        const random_amt = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);

        try {
            await profile_model.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        dailyLastUsed: Date.now(),
                    },
                    $inc: {
                        balance: random_amt,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }

        await interaction.editReply(`You redeemed ${random_amt} coins!`);
    },
};
