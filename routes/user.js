const express = require('express')
const router = express.Router()
const mysqlDb = require('../config/db').db


// Dashboard
router.get('/dashboard',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
    res.render('user/dashboard',{layout:'./layouts/main'})
    }

})

module.exports = router