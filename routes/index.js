const express = require('express')
const router = express.Router()
const mysqlDb = require('../config/db').db
const productService = require('../service/ProductService')




router.get('/', async function(req, res, next) {
    let errors = [];
    try {
        let products = await  productService.all()
      res.render('home',{layout:'./layouts/main',products})
    } catch (err) {
        errors.push({msg:err});
        res.render('home',{layout:'./layouts/main',errors})
      next(err);
    }
  });

module.exports = router
