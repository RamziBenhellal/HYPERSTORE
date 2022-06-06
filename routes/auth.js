const express = require('express')
const router = express.Router()
const UserService = require('../service/UserService')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const mysqlDb = require('../config/db').db
const passport = require('passport');
const { redirect } = require('express/lib/response')
const session = require('express-session');
 



// Login Page
router.get('/login',(req,res) => {
    if(req.session.authenticated){
        res.redirect('/')
    }
res.render('auth/login',{layout:'./layouts/main'})
})



// Register Page
router.get('/register',(req,res) => {
    res.render('auth/register',{layout:'./layouts/main'})
})

// Register Page
router.post('/register',(req,res) => {
    const {email, password,password2} = req.body;
    let errors = [];

    // Check required field
    if(!email || !password || !password2){
        errors.push({msg:'Please fill in all field'});
    }

    // Check Password match
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    

    // Check password length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    if (errors.length > 0) {
        res.render('auth/register',{layout:'./layouts/main',errors,email,password,password2})
      }
    else{
        let sql = `SELECT * FROM User WHERE email = '${email}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err)   errors.push({msg:err})
        
        if(result[0] )
        { errors.push({ msg: 'Email already exists' })
        res.render('auth/register',{layout:'./layouts/main',errors,email,password,password2})
        }
        else{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) throw err;
                 UserService.save(email,hash)
                      req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                      res.redirect('/auth/login');
                   
                });
              });
        }
        })
          
        }
 
})

// Login
router.post('/login', (req, res) => {

    if(req.session.authenticated){
        res.redirect('/')
    }

    const {email, password} = req.body;
    let errors = []
    let sql = `SELECT * FROM User WHERE email = '${email}' `
    let query = mysqlDb.query(sql, (err,result) =>{
    if(err)   throw err
    
    if(!result[0] )
    { errors.push({ msg: 'Incorrect Email or Password ' })
    res.render('auth/login',{layout:'./layouts/main',errors,email,password})
    }
    else{
        bcrypt.compare(password,result[0].password,(err,isMatch) =>{
            if(err) throw err
            if(isMatch){
                req.session.authenticated = true
                req.session.user = result[0]
                res.redirect('/')
            }else{
                errors.push({ msg: 'Incorrect Email or Password ' })
                res.render('auth/login',{layout:'./layouts/main',errors,email,password}) 
            }

        })
    }
})

  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.session.authenticated = false
    req.session.user = null
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });




module.exports = router
