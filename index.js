const express = require('express')
const app = express()
const dotenv= require('dotenv')
dotenv.config()
const port = process.env.PORT||4000
app.use(express.json())
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const session = require('express-session');
const passport = require('passport');
require('./strategies/passport-setup'); // Import passport setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Avoid saving uninitialized sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: false  // Set true in production with HTTPS
  }
}));

app.use(passport.initialize());
app.use(passport.session());





const{getUser }= require("./utils/googleUser")
const user= getUser()
app.get('/', (req, res) => {
  if(!req.user)
    return res.status(401).json({ message: 'You are not authenticated' });
  console.log('==============UUUUUUUUUUU======================');
  console.log(user);
  console.log('=====================UUUUUUUUUU===============');
  res.send(user)
})


const auth= require('./routes/auth.router')
app.use("/auth",auth)

const card= require("./routes/card.router")
app.use("/card", card)

const userData= require("./routes/userData.router")
app.use("/userData", userData)


const voucher= require("./routes/voucher.router")
app.use("/voucher", voucher)


app.use((req, res, next) => {
  console.log('==============UUUUUUUUUUU======================');
  console.log(user);
  console.log('=====================UUUUUUUUUU===============');
  next();
});

app.listen(port, () => {
   
    console.log(`Server is running on port ${port}`);

  });
  