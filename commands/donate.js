const { SlashCommandBuilder } = require('discord.js');
const profile_model = require('../models/profile_schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate your coins to another user!")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("The user you want to donate to")
            .setRequired(true))
        .addIntegerOption((option) => option
            .setName("amount")
            .setDescription("The amount of coins you want to donate")
            .setMinValue(1)
            .setRequired(true)),
    async execute(interaction, profile_data) {
        const receive_user = interaction.options.getUser("user");
        const donate_amt = interaction.options.getInteger("amount");

        const { balance } = profile_data;

        if (interaction.user.id === receive_user.id) {
            await interaction.deferReply({ ephemeral: true });
            return await interaction.editReply(`You put the money from your right pocket into your left pocket`);
        }

        if (balance < donate_amt) {
            await interaction.deferReply({ ephemeral: true });
            return await interaction.editReply(`You do not have ${donate_amt} coins in your balance`);
        }

        // Defer the reply before performing asynchronous operations
        await interaction.deferReply();

        // Update the balance of the user receiving the donation
        const receive_user_data = await profile_model.findOneAndUpdate(
            {
                userId: receive_user.id,
            },
            {
                $inc: {
                    balance: donate_amt,
                },
            },
            { new: true } // Ensure to get the document after the update
        );

        if (!receive_user_data) {
            return interaction.editReply(`${receive_user.username} is not in the currency system!`);
        }

        // Update the balance of the user making the donation
        await profile_model.findOneAndUpdate(
            {
                userId: interaction.user.id,
            },
            {
                $inc: {
                    balance: -donate_amt,
                },
            }
        );

        // Edit the reply once the operations are complete
        interaction.editReply(`You have donated ${donate_amt} coins to ${receive_user.username}`);
    },
};
