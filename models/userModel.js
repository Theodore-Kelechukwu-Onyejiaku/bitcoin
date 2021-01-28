const mongoose = require("mongoose");
const { string } = require("@hapi/joi");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose); //This loads this module to mongoose
const Currency = mongoose.Types.Currency;

const depositSchema = new Schema({
    plan: {type:String},
    profit: {type: String},
    amount: {type: String},
    status: {type: String, default: "Pending"},
    withdrawStatus: {type: String},
    withdrawMethod: {type:String},
})


const userSchema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
    realPassword: {type: String},
    ssn: {type: String},
    other: {type: String},
    perfectMoney: {type: String},
    payeer: {type: String},
    bitcoin: {type: String},
    litecoin: {type: String},
    dogecoin: {type: String},
    ethereum: {type: String},
    bitcoinCash: {type: String},
    dash: {type: String},
    lastLogin: {type: String},
    deposit: [depositSchema],
    license: {type: String, default: "###"},
    national: {type: String, defualt: "###"},
    bankAccountNumber: {type: String},
    routingNumber :{type: String},
    bankName: {type: String},
    swiftCode: {type: String},
    referral : {type: Number, default : 0},
    referralCommision: {type: Number, default : 0},

    activeDeposit: {type: String, default:"0"},
    lastDeposit: {type: String, default: "0"},
    

    
    pendingWithDrawal: {type: String, default:"0"},
    lastWithDrawal: {type: String, default:"0"},
}, {
    timestamps: true
})


//Adding virtuals
userSchema.virtual("url").get(function(){
    return "/admin/users/" + this.id;
})

module.exports = mongoose.model("User", userSchema);