const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const profile_model = require('../models/profile_schema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Access to all the admin commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => subcommand
            .setName("add")
            .setDescription("Add coins to an users balance")
            .addUserOption((option) => option
                .setName("user")
                .setDescription("The user you want to add coins to")
                .setRequired(true))
            .addIntegerOption((option) => option
                .setName("amount")
                .setDescription("The amount of coins to add")
                .setMinValue(1)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName("subtract")
            .setDescription("Subtract coins from an users balance")
            .addUserOption((option) => option
                .setName("user")
                .setDescription("The user you want to subtract coins from")
                .setRequired(true))
            .addIntegerOption((option) => option
                .setName("amount")
                .setDescription("The amount of coins to subtract")
                .setMinValue(1)
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const admin_subcommand = interaction.options.getSubcommand();

        if (admin_subcommand === "add") {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');

            await profile_model.findOneAndUpdate(
                {
                    userId: user.id
                },
                {
                    $inc: {
                        balance: amount,
                    },
                }
            );

            await interaction.editReply(`Added ${amount} coins to ${user.username}'s balance`);
        }

        if (admin_subcommand === "subtract") {
            const user = interaction.options.getUser('user');
            const amount = interaction.options.getInteger('amount');

            await profile_model.findOneAndUpdate(
                {
                    userId: user.id
                },
                {
                    $inc: {
                        balance: -amount,
                    },
                }
            );

            await interaction.editReply(`Subtracted ${amount} coins from ${user.username}'s balance`);
        }
    },
};