const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    username: { type: String, lowercase: true, required: true},
    password: { type: String, required: true},
    tlength: { type: Number, default: 0},
    tbhs: [
        {
            tbh: { type: Schema.Types.ObjectId, ref: 'Tbh'},
            createdon:  { type: Date, default: Date.now}
        }
    ],
    viewsgiven: { type: Number, default: 0},
    created: { type: Date, default: Date.now}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.compare = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);