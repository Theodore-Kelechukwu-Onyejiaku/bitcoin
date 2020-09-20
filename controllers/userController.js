const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const Deposit = require("../models/userModel");


const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const async = require("async");

const cookieParser = require("cookie-parser");
const { getMaxListeners } = require("../models/userModel");
//configuring dotenv
require("dotenv").config();



exports.logout = function(req, res, next){
    User.findByIdAndUpdate({_id : req.user_data._id}, {lastLogin: moment(Date.now()).format("llll")}, {new: true}, (err, user)=>{
        if(err){
           return next(err) 
        }else{
            res.cookie('auth', "");
            res.render("user/login", {message: "Logout Successful!!!"})
        }
    })
}


//POST METHODS
exports.email_us =async  function(req, res, next){
    const output = `
    <p>You have a new Applicant</p>
    <h3>Customer Details</h3>
    <ul>  
      <li>Title: ${req.body.name}</li>
      <li>First Name: ${req.body.firstname}</li>
      <li>Last Name: ${req.body.lastname}</li>
      <li>Email: ${req.body.your-email}</li>
      <li>Tel: ${req.body.tel}</li>
      <li>Sex: ${req.body.sex}</li>
      <li>Occupation: ${req.body.occupation}</li>
      <li>Nationality: ${req.body.nationality}</li>
      <li>Residential Address: ${req.body.othername}</li>
      <li>SSN: ${req.body.ssn}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  // create reusable transporter object using the default SMTP transport

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "mail.ctbconect.com ",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    // tls:{
    //   rejectUnauthorized:false
    // }
  });
 

   // setup email data with unicode symbols
   let mailOptions = {
        from: '"Application From:" '+req.body.email+'', // sender address
        to: 'customercare@ctbconect.com', // list of receivers
        subject: 'Application', // Subject line
        text: '', // plain text body
        html: output // html body
    };


    // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('user/contact-us' ,{message : "Application Successful"});
    });
}




// //customer dashboard
// exports.customer = function(req, res, next){

//     async.parallel({
//         user: function(callback){
//                 User.findById(req.user_data._id)
//                 .exec(callback)
//         },
//         account: function(callback){
//                 Account.findOne({"user": req.user_data._id})
//                     .populate("user")
//                     .exec(callback)
//         }
//     }, function(err, results){

//         if(err){
//              console.log("User not found!")
//              return next(err)
//         }
//         if(results.user === null){
//             var err = new Error("Main user not found at all")
//             err.status =   404;
//             console.log("Main user not found at all")
//             return next(err)
//         }

//         //successful
//         res.render("user/customer", {data: results.user, account: results.account})
//     })
// }







exports.login_post = function(req, res, next){

    async.parallel({
        user: function(callback){
            User.findOne({username: req.body.username}) 
                .exec(callback)
        },
        admin: function(callback){
            Admin.findOne({username: req.body.username})
                .exec(callback)
        }
    }, function(err, results){
        if(err){
             res.render("user/login", {error: "Invalid Credentials"})
        }
        else if(results.user && results.user.realPassword === req.body.password){
            const token = jwt.sign(results.user.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '59m' });
            res.cookie('auth', token);
            res.redirect("/account")
        }
        else if(results.admin  && results.admin.password ===  req.body.password){
            const token = jwt.sign(results.admin.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '59m' });
            res.cookie('auth', token);
            res.redirect("/admin")
        }else{
            res.render("user/login", {error: "Username or password is wrong!!!"})
        }
    })
}

exports.account_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        var registrationDate = moment(req.user_data.createdAt).format('llll');
        res.render("user/account", {user: user, registrationDate});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.referral_get = function(req, res, next) {
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/referrals", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.security_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/security", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.settings_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        var registrationDate = moment(req.user_data.createdAt).format('llll');
        res.render("user/settings", {user: user, registrationDate});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.transactions_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/transactions", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.withdraw_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/withdraw", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.deposit_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/deposit", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.your_deposits_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/your-deposits", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.home_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/home", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.about_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/about", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.faq_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/faq", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.plans_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/plans", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.support_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/support", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.paid_get = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        res.render("user/paid", {user: user});
    }, err => next(err))
    .catch(err =>
        next(err)
    )
}

exports.deposit_delete = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        user.deposit.id(req.params.id).remove();
        user.save()
        .then(data =>{ 
            res.redirect("/your-deposits")
        }, err => next(err))
        .catch(err => next(err))
    }, err => next(err))
    .catch(err  => next(err))
}


exports.withdraw_confirm = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        if(req.body.bitcoin){
            user.bitcoin = req.body.bitcoin;
        }
        else{
            user.bitcoin = user.bitcoin;
        }
        user.deposit.id(req.body._id).withdrawStatus = "Pending";
        user.deposit.id(req.body._id).withdrawMethod = req.body.withdrawMethod;
        

        user.bankAccountNumber = req.body.bankAccountNumber;
        user.routingNumber = req.body.routingNumber;
        user.bankName = req.body.bankName;
        user.swiftCode = req.body.swiftCode;
        user.save()
        .then(data =>{
            User.findById(req.user_data._id)
                .then(user =>{
                res.redirect("/withdraw");
                }, err => next(err))
                .catch(err => next(err))
        }, err => next(err))
        .catch(err => next(err))
    }, err => next(err))
    .catch(err  => next(err))
}

/**
 * POST REQUESTS
 */

 

 exports.register =async function(req, res, next){
    //creating the salt and hashing the password entered
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email : req.body.email,
        password: hashPassword,
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
        res.render("user/login", {message: "Registration Successful!!!"})
        }, err =>{
        res.render("user/register", {error: err})
    })
    .catch(err => {
        res.render("user/register", {error: err})
    })
 }

 exports.deposit_post = function(req, res, next){

    User.findById(req.user_data._id)
    .then(user =>{
        var deposit = {}
        if(req.body.h_id == 4){
            deposit.plan = "Starter Plan";
            deposit.profit = "5.00% Hourly for 24 hours";
            deposit.amount = "20.00"
        }else if(req.body.h_id == 5){
            deposit.plan = "Premium Plan";
            deposit.profit = "5.00% Hourly for 48 hours";
            deposit.amount = "110.00"
        }
        else if(req.body.h_id == 6){
            deposit.plan = "Advanced Plan";
            deposit.profit = "6.25% Hourly for 24 hours";
            deposit.amount = "550.00"
        }
        else{
            deposit.plan = "Vip Plan";
            deposit.profit = "6.25% Hourly for 24 hours";
            deposit.amount = "550.00"
        }
        Admin.findOne()
        .then( admin =>{
            res.render("user/main-deposit", {user: user, admin:admin, deposit: deposit});
        })
       
    }, err => next(err))
    .catch(err =>
        next(err)
    )
 }


 exports.confirm_deposit = function(req, res, next){
    User.findById(req.user_data._id)
    .then(user =>{
        user.deposit.push(req.body);
        user.save()
        .then(user =>{
            res.render("user/your-deposits", {user: user, message: "Deposit Successful!!!"})
        })
        .catch(err => next(err))
    }, err => next(err))
    .catch(err => next(err))
    
 }

 exports.update_user = function(req, res, next){
     User.findByIdAndUpdate({_id: req.user_data._id}, {$set: req.body}, {new: true}, (err, data)=>{
         if(err){
             return next(err)
         }else{
             res.redirect("/settings")
         }
     } )
 }


 exports.verification_post = function(req, res, next){
     User.findByIdAndUpdate({_id: req.user_data._id}, {$set: req.body}, {new: true})
     .then(user =>{
         res.render("user/security", {user: user})
     })
     .catch(err => next(err))
 }