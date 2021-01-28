const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");



//Setting up images storage
let storage = multer.diskStorage({
  destination: "./public/uploads/images",
  filename: (req, file, cb)=>{
      cb(null, Date.now()+".png")
  },
})

let upload = multer({
  storage : storage,
  fileFilter: (req, file, cb)=>{
      checkFileType(file, cb);
  }
})

//Function to check file type
function checkFileType(file, cb){
  const fileTypes = /jpg|jpg|png|gif|jpeg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

  if(extname){
      return cb(null, true);
  }else{
      cb("Error: Please images only.");
  }
}


//Middleware to verify token
function verify(req, res, next) {
    var token = req.cookies.auth;
    // decode token
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, token_data) {
        if (err) {
            console.log("YOu must login to view this page")
           return res.status(403).render('user/login', {error: "Please you must login to view this page"});
        } else {
          req.user_data = token_data;
          next();
        }
      });
    } else {
        return res.status(403).render('user/login', {error: "Please you must login to view this page!!!"});
    }
  }

router.get("/account", verify, userController.account_get);
router.get("/referral",verify, userController.referral_get);
router.get("/referral/:userId/:username", userController.getReferral);
router.get("/verification",verify, userController.security_get);
router.get("/settings",verify, userController.settings_get);
router.get("/transactions",verify, userController.transactions_get);
router.get("/withdraw",verify, userController.withdraw_get)
router.get("/deposit",verify, userController.deposit_get)
router.get("/your-deposits",verify, userController.your_deposits_get)
router.get("/home",verify, userController.home_get)
router.get("/about",verify, userController.about_get)
router.get("/faq",verify, userController.faq_get)
router.get("/plans",verify, userController.plans_get)
router.get("/support",verify, userController.support_get)
router.get("/paid",verify, userController.paid_get)
router.get("/logout",verify, userController.logout);
router.get("/deposit/:id", verify, userController.deposit_delete);





/**
 *  POST REQUESTS
*/

router.post("/deposit", verify, userController.deposit_post);
router.post("/register", userController.register);
router.post("/login", userController.login_post);
router.post("/confirm_deposit", verify, userController.confirm_deposit);
router.post("/user/update", verify, userController.update_user);
router.post("/ssn",upload.single("ssn"), verify, userController.ssn_post)
router.post("/other",upload.single("other"), verify, userController.other_post)
router.post("/withdraw", verify, userController.withdraw_confirm);


module.exports = router;