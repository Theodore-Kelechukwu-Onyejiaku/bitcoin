const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Account = require("../models/accountModel");
const router = require("../routes/adminRoutes");

const mongoose = require("mongoose");




exports.register = function(req, res){
    res.render("admin/admin-register")
}
