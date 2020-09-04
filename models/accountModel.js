const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const accountSchema = new Schema({
//     user:[{type: Schema.Types.ObjectId, ref: "User"}],
//     deposit: String,
//     withdrawals: String,
//     dateTwo : String,
//     description: String,
//     account_balance: String,
//     ref: String,
//})

module.exports = mongoose.model("Account", accountSchema);