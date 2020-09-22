const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const router = require("../routes/adminRoutes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');

const mongoose = require("mongoose");


exports.dashboard = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>
        User.find().countDocuments({})
        .then( numberOfUsers =>{
            res.render("admin/dashboard", {admin: admin, numberOfUsers})
        })
    )
}


exports.register = function(req, res, next){
    res.render("admin/admin-register")
}

exports.users_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.find()
        .then(user =>{
            res.render("admin/users", {admin: admin, user: user})
        })
        .catch(err => next(err)) 
    })
    .catch(err => next(err))
}

exports.user_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.id)
        .then(user =>{
            //var registrationDate = moment(req.user_data.createdAt).format('llll');
            res.render("admin/user", {user: user, admin: admin});
        }, err => next(err))
        .catch(err =>
            next(err)
        )
    })
    .catch(err => next(err))
}

exports.user_delete = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findByIdAndRemove({_id: req.params.id}, (err, data)=>{
            if(err){
                return next(err)
            }else{
                User.find()
                .then(user =>{
                    res.render("admin/users", {admin: admin, user: user})
                })
                .catch(err => next(err)) 
            }
        } )
    })
    .catch(err => next(err))
}


exports.addUser_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.id)
        .then(user =>{
            //var registrationDate = moment(req.user_data.createdAt).format('llll');
            res.render("admin/add-user", {user: user, admin: admin});
        }, err => next(err))
        .catch(err =>
            next(err)
        )
    })
    .catch(err => next(err))
}

exports.deposits_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.find()
        .then(user =>{
            res.render("admin/deposits", {admin: admin, user: user})
        })
        .catch(err => next(err)) 
    })
    .catch(err => next(err))
}


exports.withdrawals_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.find()
        .then(user =>{
            res.render("admin/withdrawals", {admin: admin, user: user})
        })
        .catch(err => next(err)) 
    })
    .catch(err => next(err))
}

exports.deposits_get_user = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.id)
        .then(user =>{
            res.render("admin/user-deposit", {user: user, admin: admin});
        }, err => next(err))
        .catch(err =>
            next(err)
        )
    })
    .catch(err => next(err))
}

exports.withdrawals_get_user = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.id)
        .then(user =>{
            res.render("admin/user-withdrawal", {user: user, admin: admin});
        }, err => next(err))
        .catch(err =>
            next(err)
        )
    })
    .catch(err => next(err))
}


exports.deposit_delete  = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.userId)
            .then(user =>{
            user.deposit.id(req.params.id).remove();
            user.save()
                .then(data =>{ 
                    res.render("admin/user-deposit", {user: data, admin: admin, message: "Deleted Successfully!!!"});
                }, err => next(err))
            .catch(err => next(err))
        }, err => next(err))
        .catch(err  => next(err))
    })
    .catch(err => next(err))
}


exports.settings_get = function(req,res, next){
    Admin.findById(req.user_data._id)
    .then(admin => {
        res.render("admin/settings", {admin: admin})
        }
    )
}


exports.bitcoinAddress_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin => {
        res.render("admin/bitcoin-address", {admin: admin})
        }
    )
}

/**
 * 
 * POST REQUESTS
 */

exports.register_post = function(req, res, next){
    Admin.create(req.body)
    .then(admin =>{
        console.log("Admin registered successfully!");
        res.redirect("/")
    }, err => next(err))
    .catch(err => next(err))
}


exports.user_update = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findByIdAndUpdate({_id: req.body._id}, {$set: req.body}, {new: true}, (err, data)=>{
            if(err){
                return next(err)
            }else{
                res.render("admin/user", {user: data, admin: admin, message: "User updated successfully!"})
            }
        } )
    })
    .catch(err => next(err))
}


exports.verification_get = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin  =>{
        User.find()
        .then(user =>{
            res.render("admin/verification", {user:user, admin: admin})
        })
    })
}


exports.addUser_post = function(req, res, next){
    //creating the salt and hashing the password entered
    //const salt = bcrypt.genSalt(10);
    //const hashPassword = bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email : req.body.email,
        password: req.body.password,
        realPassword: req.body.password,
        bitcoin: req.body.bitcoin,
        litecoin: req.body.litecoin,
        dogecoin: req.body.dogecoin,
        ethereum: req.body.ethereum,
        bitcoinCash: req.body.bitcoinCash,
        perfectMoney: req.body.perfectMoney,
        payeer: req.body.payeer,
        dash: req.body.dash,
    })
    user.save()
    .then(user =>{
        Admin.findById(req.user_data._id)
            .then(admin =>{
                User.find()
                    .then(user =>{
                    res.render("admin/users", {admin: admin, user: user, message: "User created successfully!!!"})
                    })
                    .catch(err => next(err)) 
            })
            .catch(err => next(err))
    })
    .catch(err => {
        //Serr = new Error("Error creating user");

        next(err);
    })
}


exports.deposit_update = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.body.userId)
            .then(user =>{
            user.deposit.id(req.body.id).status = req.body.status;
            user.activeDeposit = user.deposit.id(req.body.id).amount;
            user.deposit.id(req.body.id).withdrawStatus = "Ask for for withdrawal";
            user.save()
                .then(data =>{ 
                    res.render("admin/user-deposit", {user: data, admin: admin, message: "Updated Successfully!!!"});
                }, err => next(err))
            .catch(err => next(err))
        }, err => next(err))
        .catch(err  => next(err))
    })
    .catch(err => next(err))
}


exports.withdrawal_update = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.body.userId)
            .then(user =>{
            //user.deposit.id(req.body.id).status = req.body.status;
            user.deposit.id(req.body.id).withdrawStatus = req.body.withdrawStatus;
            user.lastWithDrawal = user.deposit.id(req.body.id).amount;
            user.save()
                .then(data =>{ 
                    res.render("admin/user-withdrawal", {user: data, admin: admin, message: "Updated Successfully!!!"});
                }, err => next(err))
            .catch(err => next(err))
        }, err => next(err))
        .catch(err  => next(err))
    })
    .catch(err => next(err))
}


exports.bitcoinAddress_post = function(req, res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        if(req.file){

            const directory = 'public/uploads/images';

            let urlOfImage = req.file.path.replace('public', '');

            admin.bitcoinAddress = req.body.bitcoinAddress;
            admin.barcode = urlOfImage;
            
            admin.save()
            .then(data =>{
                fs.readdir(directory, (err, files) => {
                    if (err) throw err;
        
                    for (const file of files) {
                        if(file == req.file.filename){
                            continue
                        }
                        fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                        });
                    }
                });
                res.render("admin/bitcoin-address", {admin: data, message: "Updated successfully!!!"})
            })
            .catch(err => next(err))
        }else{
            admin.bitcoinAddress = req.body.bitcoinAddress;
            
            admin.save()
            .then(data =>{
                res.render("admin/bitcoin-address", {admin: data, message: "Updated successfully!!!"})
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
}


exports.user_verfication_get = function(req,res, next){
    Admin.findById(req.user_data._id)
    .then(admin =>{
        User.findById(req.params.id)
            .then(user =>{
                res.render("admin/user-verification", {user: user, admin: admin});
        }, err => next(err))
        .catch(err  => next(err))
    })
    .catch(err => next(err))
}