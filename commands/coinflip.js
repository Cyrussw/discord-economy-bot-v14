const { SlashCommandBuilder } = require('discord.js');
const { coinflipReward } = require('../global_values.json');
const profile_model = require('../models/profile_schema');
const parsems = require('parse-ms-2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin for a free bonus")
        .addStringOption((option) => option
            .setName('choice')
            .setDescription('Heads or Tails')
            .setRequired(true)
            .addChoices(
                { name: "Heads", value: "Heads" },
                { name: "Tails", value: "Tails" })
        ),
    async execute(interaction, profile_data) {
        const { id } = interaction.user;
        const { coinflipLastUsed } = profile_data;

        const cooldown = 3600000;
        const time_left = cooldown - (Date.now() - coinflipLastUsed);

        if (time_left > 0) {
            await interaction.deferReply({ ephemeral: true });

            const { minutes, seconds } = parsems(time_left);

            return await interaction.editReply(`Claim your next coinflip in ${minutes} min ${seconds} sec`);
        }

        await interaction.deferReply();

        await profile_model.findOneAndUpdate(
            {
                userId: id
            },
            {
                $set: {
                    coinflipLastUsed: Date.now(),
                },
            }
        )

        const random_num = Math.floor(Math.round());
        const result = random_num ? "Heads" : "Tails";
        const choice = interaction.options.getString("choice");

        if (choice === result) {
            await profile_model.findOneAndUpdate(
                {
                    userId: id
                },
                {
                    $inc: {
                        balance: coinflipReward,
                    }
                }
            );

            await interaction.editReply(`Winner! You won ${coinflipReward} coins with **${choice}**`);
        } else {
            await profile_model.findOneAndUpdate(
                {
                    userId: id
                },
                {
                    $inc: {
                        balance: -1,
                    }
                }
            );

            await interaction.editReply(`Lost! You lose 1 coin because your choice ${choice} but it was ${result} win.`);
        }
    },
};