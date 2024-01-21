const mongoose = require('mongoose');

const profile_schema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    serverId: { type: String, require: true },
    balance: { type: Number, default: 0},
    dailyLastUsed: { type: Number, default: 0 },
    coinflipLastUsed: { type: Number, default: 0}
});

const model = mongoose.model('saidb', profile_schema);

module.exports = model;