const router= require('express').Router()
const uploadFile= require("../middleware/upload")
const userData=require("../controllers/userData")
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You are not authenticated' });
};

router.put("/changeProfile/:id",uploadFile.upload.single('avatar'),userData.changProfilePhoto)
router.get("/getAllUsers",ensureAuthenticated, userData.getAllUsers)
router.post("/sendEmail", userData.sendEmail)
router.put("/changeInfo/:id", userData.changeInfo)

// router.post('/send-email', ensureAuthenticated, (req, res, next) => {
//     userData.sendEmail(req, res, next);
// });
module.exports =router