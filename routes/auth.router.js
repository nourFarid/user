const auth = require('../controllers/auth')
const router= require('express').Router()
const passport = require('passport');
const uploadFile= require("../middleware/upload")
const{saveUser, getUser }= require("../utils/googleUser")
router.post("/signup",uploadFile.upload.single('avatar'),auth.signUp )

router.post("/login",auth.login )



// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    
  }));
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, return user profile
      if (req.user) {
        saveUser(req.user)
        const user= getUser()
        console.log('======IN CALLBACK==============================');
        console.log(user);
        console.log('====================================');
        res.json(
          req.user  // Send the authenticated user's profile as JSON
        );
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    }
  );
  

module.exports = router