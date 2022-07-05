const express = require('express')
const router = express.Router()
const stripe = require('stripe')('sk_test_51LGUW0KfGPMzRY3cpeZwFuC6hEtu0isq0AG5qbBHagx8bYHeHzFfJg2RGtpHJN6GrvORfGYljm0inzH2xICgAMtS00IEBNgV3u')
const clientService = require('../service/ClientService')
const addressService = require('../service/AddressService')
const productService = require('../service/ProductService')
const articleService = require('../service/ArticleService')
const cartService = require('../service/CartService')
const orderService = require('../service/OrderService')
const colorService = require('../service/ColorService')
const sizeService = require('../service/SizeService')

router.get('/infovalidation',async function(req,res){
    let contact

    try {
        contact = await addressService.findByUserId(req.session.user.userId)
        if(contact != undefined){
      let cart = await cartService.findByUserId(req.session.user.userId) 
      let data = await cartService.getArticles(cart.idCart)
      let items = []
      let total = 0
      for (let i = 0;i< data.length; i++){
        total+= data[i].totalPrice
      let product = await productService.find(data[i].idProduct)
      let article = await articleService.find(data[i].idArticle)
      let color = await colorService.find(data[i].idColor)
      let size = await sizeService.find(data[i].idSize)
      items.push({quantity:data[i].articleQuantity,totalPrice:data[i].totalPrice,product:product,article:article,color:color,size:size})

        }
        res.render('purshase/infovalidation',{contact,items,total})
        }
        else{
          req.flash('error_msg','Fill your informations to complete pushase')
          res.redirect('/user/dashboard')
        } 

    } catch (error) {
        console.log(error)
        
    }

    
})


router.post('/checkout/:amount',async function(req,res){

    const amount = req.params.amount;
  
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
      amount,

      description: 'Web Development Ebook',
      currency: 'eur',
      customer: customer.id
    }))
    .then(async function(charge)  {

      let cart = await cartService.findByUserId(req.session.user.userId) 
      let data = await cartService.getArticles(cart.idCart)
      let total = 0
      for (let i = 0;i< data.length; i++){
        total+= data[i].totalPrice
        let item = [charge.id,data[i].idArticle,data[i].articleQuantity,data[i].totalPrice]
        orderService.insertArticleIntoOrder(item)
        }
        let client = await clientService.findByUserId(req.session.user.userId)
        let order = [charge.id,client.idClient,total,'Passed']
        orderService.insert(order)
       
      res.render('purshase/success')
    }
      );
})

module.exports = router