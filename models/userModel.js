const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    account_number: String,
    account_name: String,
    username: String,
    password: String,
    telephone: String,
    routing_number: String,
    account_balance: String,
    account_type: String,
    userfile: String,
    // deposit: String,
    // withdrawals: String,
    // dateTwo : String,
    // description: String,
    // ref: String,
    date: String,
})

module.exports = mongoose.model("User", userSchema);