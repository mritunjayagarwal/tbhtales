const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const tbhSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    message: String,
    created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Tbh', tbhSchema);