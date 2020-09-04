const User = require("../models/userModel");
//const Admin = require("../models/adminModel");


const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const async = require("async");

const cookieParser = require("cookie-parser");
const { getMaxListeners } = require("../models/userModel");
//configuring dotenv
require("dotenv").config();



exports.logout = function(req, res, next){
    res.cookie('auth', "");
    res.redirect("/login")
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
    
            User.findOne({username: req.body.username})
                .then(data =>{
                    if(data.password === req.body.password){
                        const token = jwt.sign(data.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '59m' });
                        res.cookie('auth', token);
                        res.redirect("/customer")
                    }else{
                        res.render("user/login", {message: "Username or password is wrong!!!"})
                    }
                })
                .catch(err => {
                    Admin.findOne({username: req.body.username})
                        .then(data =>{
                            if(data.password === req.body.password){
                                const token = jwt.sign(data.toJSON(), process.env.TOKEN_SECRET, {  expiresIn: '59m' });
                                res.cookie('auth', token);
                                res.redirect("/admin")
                            }else{
                                res.render("user/login", {message: "Invalid Credentials!!!"})
                            }
                        })
                        .catch(err =>{
                            res.render("user/login", {message: "Invalid Credentials"})
                        })
                })
}


exports.account_get = function(req, res, next){
    res.render("user/account");
}

exports.referral_get = function(req, res, next) {
    res.render("user/referrals");
}

exports.security_get = function(req, res, next){
    res.render("user/security");
}

exports.settings_get = function(req, res, next){
    res.render("user/settings");
}

exports.transactions_get = function(req, res, next){
    res.render("user/transactions");
}

exports.withdraw_get = function(req, res, next){
    res.render("user/withdraw");
}

exports.deposit_get = function(req, res, next){
    res.render("user/deposit")
}

exports.your_deposits_get = function(req, res, next){
    res.render("user/your-deposits")
}

exports.home_get = function(req, res, next){
    res.render("user/home")
}

exports.about_get = function(req, res, next){
    res.render("user/about")
}

exports.faq_get = function(req, res, next){
    res.render("user/faq")
}

exports.plans_get = function(req, res, next){
    res.render("user/plans")
}

exports.support_get = function(req, res, next){
    res.render("user/support")
}

exports.paid_get = function(req, res, next){
    res.render("user/paid")
}

