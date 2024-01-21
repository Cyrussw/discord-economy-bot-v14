const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[${client.user.username}]: Discord ile bağlantı sağlandı!`);
        client.user.setActivity("Sairus CORE!", {
            type: ActivityType.Playing,
        });
    },
};