const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

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






router.get("/",verify, adminController.dashboard)



router.get("/users",verify, adminController.users_get);
router.get("/api/v1/admin/register", adminController.register)
router.get("/users/:id",verify, adminController.user_get);
router.get("/user/delete/:id", verify, adminController.user_delete);
router.get("/user/add", verify, adminController.addUser_get);
router.get("/deposits", verify, adminController.deposits_get);
router.get("/withdrawals", verify, adminController.withdrawals_get);
router.get("/deposits/:id", verify, adminController.deposits_get_user)
router.get("/withdrawals/:id", verify, adminController.withdrawals_get_user)
router.get("/deposits/delete/:id/:userId", verify, adminController.deposit_delete);
router.get("/settings/", verify, adminController.settings_get);
router.get("/bitcoinAddress", verify, adminController.bitcoinAddress_get);
router.get("/verifications", verify, adminController.verification_get);
router.get("/:id/verification", verify, adminController.user_verfication_get);

router.post("/api/v1/admin/register", adminController.register_post);
router.post("/user/update", verify, adminController.user_update);
router.post("/user/add", verify, adminController.addUser_post);
router.post("/deposits/update", verify, adminController.deposit_update);
router.post("/withdrawals/update", verify, adminController.withdrawal_update);
router.post("/bitcoinAddress",upload.single("barcode"), verify, adminController.bitcoinAddress_post);




module.exports = router;