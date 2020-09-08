const mongoose = require("mongoose");
const { string } = require("@hapi/joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
    realPassword: {type: String},
    perfectMoney: {type: String},
    payeer: {type: String},
    bitcoin: {type: String},
    litecoin: {type: String},
    dogecoin: {type: String},
    ethereum: {type: String},
    bitcoinCash: {type: String},
    dash: {type: String},
})

module.exports = mongoose.model("User", userSchema);