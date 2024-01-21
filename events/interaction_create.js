const { Events } = require('discord.js');
const profile_model = require('../models/profile_schema');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        let profile_data;

        try {
            profile_data = await profile_model.findOne({ userId: interaction.user.id });

            if (!profile_data) {
                profile_data = await profile_model.create({
                    userId: interaction.user.id,
                    serverId: interaction.guild.id,
                });
            }

        } catch (err) {
            console.log(err);
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`'${interaction.commandName}' ile eşleşen komut yok!`);
            return;
        }

        try {
            await command.execute(interaction, profile_data);
        } catch (error) {
            console.error(`'${interaction.commandName}' komut işlenirken hata oluştu!`);
            console.error(error);
        }
    }
}