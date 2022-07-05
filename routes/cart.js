const express = require('express')
const router = express.Router()
const productService = require('../service/ProductService')
const articleService = require('../service/ArticleService')
const cartService = require('../service/CartService')
const colorService = require('../service/ColorService')
const sizeService = require('../service/SizeService')

router.get('/', async function(req, res) {
    try {
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
        
      res.render('cart/index',{items,total})
    } catch (err) {

    }
  });

router.post('/add/:id', async function(req, res) {
  try {
    const {color,size,quantity} = req.body
    let errors = []

  
    // Check required field
    if(!color || !size || !quantity){
        errors.push({msg:'Please fill in all field'});
    }
    let product = await productService.find(req.params.id)
    let article = await articleService.findByIdProductIdColorIdSize(req.params.id,color,size)
    let cart = await cartService.findByUserId(req.session.user.userId)
    let totalPrice = article.price * quantity

    let data = [cart.idCart,article.idArticle,quantity,totalPrice]

    cartService.insertArticleIntoCart(data)
    req.session.cartQuantity = await cartService.articleNumbre(req.session.user.userId)

  
    res.redirect('/cart')
  } catch (err) {

    console.log(err)

  }
});  

module.exports = router


