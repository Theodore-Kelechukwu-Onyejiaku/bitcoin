const mongoose = require("mongoose");
const { mongo } = require("mongoose");

const Schema = mongoose.Schema;

var adminSchema = new Schema({
    username: String,
    name: String,
    email: String,
    password: String, 
    bitcoinAddress: String,
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Admin", adminSchema);