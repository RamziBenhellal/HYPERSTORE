const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const bodyParser = require('body-parser')
const connectMysql = require('./config/db').connectMysql
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')


// Load config
dotenv.config({path:'./config/config.env'})

//connect database
connectMysql()

// initialise express
const app = express()


// Passport Config
require('./config/passport')(passport);



// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main');


// Body Parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: false
    })
  );

  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
 
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user;
    res.locals.cartQuantity = req.session.cartQuantity
    res.locals.authenticated = req.session.authenticated
    next();
  });


  


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/client',require('./routes/client'))
app.use('/user',require('./routes/user'))
app.use('/product',require('./routes/product'))
app.use('/purshase',require('./routes/purshase'))
app.use('/cart',require('./routes/cart'))



const PORT = process.env.PORT || 5000 

app.listen(PORT , console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));