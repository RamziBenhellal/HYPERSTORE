const express = require('express')
const router = express.Router()
const mysqlDb = require('../config/db').db



// Register Client
router.get('/info',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else
    res.render('client/info',{layout:'./layouts/main'})

})

// Register Client
router.post('/info',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }

    let user = req.session.user
    const {firstname, lastname,birthdate,phone} = req.body;
    let errors = [];

    

    // Check required field
    if(!firstname || !lastname || !birthdate || !phone){
        errors.push({msg:'Please fill in all field'});
    }

    if (errors.length > 0) {
        res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})
      }
     else{
        console.log(req.body)
     } 



})

module.exports = router