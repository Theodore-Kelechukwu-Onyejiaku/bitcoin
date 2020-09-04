const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const jwt = require("jsonwebtoken");

//Middleware to verify token
function verify(req, res, next) {
    var token = req.cookies.auth;
    // decode token
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, token_data) {
        if (err) {
            console.log("YOu must login to view this page")
           return res.status(403).render('user/login', {message: "Please you must login to view this page"});
        } else {
          req.user_data = token_data;
          next();
        }
      });
    } else {
        return res.status(403).render('user/login', {message: "Please you must login to view this page"});
    }
  }

router.get("/account", userController.account_get);
router.get("/referral", userController.referral_get);
router.get("/security", userController.security_get);
router.get("/settings", userController.settings_get);
router.get("/transactions", userController.transactions_get);
router.get("/withdraw", userController.withdraw_get)
router.get("/deposit", userController.deposit_get)
router.get("/your-deposits", userController.your_deposits_get)
router.get("/home", userController.home_get)
router.get("/about", userController.about_get)
router.get("/faq", userController.faq_get)
router.get("/plans", userController.plans_get)
router.get("/support", userController.support_get)
router.get("/paid", userController.paid_get)




module.exports = router;