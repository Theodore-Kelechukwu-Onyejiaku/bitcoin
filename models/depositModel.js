const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose); //This loads this module to mongoose
const Currency = mongoose.Types.Currency;

const depositSchema = new Schema({
    user :[{type: Schema.Types.ObjectId, ref: "User"}],
    plan: {type:String},
    profit: {type: String},
    amount: {type: Currency}
})


module.exports = mongoose.model("Deposit", depositSchema);