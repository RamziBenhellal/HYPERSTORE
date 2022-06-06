const express = require('express')
const router = express.Router()
const mysqlDb = require('../config/db').db



router.get('/',(req,res) => {
    let products = []
    let sql = `SELECT * FROM Product `
    let query = mysqlDb.query(sql, (err,result) =>{
    if(err)   throw err
    products = result
    res.render('home',{layout:'./layouts/main',products})
    })

})

module.exports = router
