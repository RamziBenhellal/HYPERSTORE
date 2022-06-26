const express = require('express')
const router = express.Router()
const productService = require('../service/ProductService')
const articleService = require('../service/ArticleService')
const sizeService = require('../service/SizeService')
const colorService = require('../service/ColorService')

// /product/details  GET
router.get('/details/:id',async function(req,res){

   

    let product
    let articles
    let sizes
    let colors = new Map()
    try {
    product = await productService.find(req.params.id)
    articles = await articleService.findAllByIdProduct(req.params.id)

    for (let i = 0;i< articles.length; i++) {      
        let color = await colorService.find(articles[i].idColor)
        colors.set(color.idColor,color)
    }
    console.log(colors)
    
} 
    catch (error) {
        
    }

    res.render('product/details',{layout:'layouts/main', product, articles,colors})
})

// /product/details POST

router.post('/details/:id',async function(req,res){
    let idColor = Number(req.body.idColor)
    let sizes = []
    let articles
    try {
        articles = await articleService.findAllByIdProductIdColor(req.params.id,idColor)
        for (let i = 0; i < articles.length; i++) {
            let size = await sizeService.find(articles[i].idSize)
            sizes.push(size)
            
        }
        let rst = '<h5 class="sizes">sizes: '
        sizes.forEach(size => {
            rst = rst +  ' <input  name="size" type="radio" titel= "size" value="'+size.idSize+'"/> '+size.sign + '\t ' 
        });
        rst += '</h5>'
        

        
        res.send({html: rst})  
      
        
        
    } catch (error) {
        console.log(error)
    }
   

})



module.exports = router
