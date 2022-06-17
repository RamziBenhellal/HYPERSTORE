const express = require('express')
const router = express.Router()
const mysqlDb = require('../config/db').db



// Register Client info get
router.get('/info',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
        let sql = `SELECT * FROM Client WHERE userId = '${req.session.user.userId}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err)   errors.push({msg:err})

        if(result[0] )
        {
            const firstname =result[0].firstname
            const lastname = result[0].lastname
            const birthdate = result[0].birthdate
            const phone = result[0].phone

            res.render('client/info',{layout:'./layouts/main',firstname,lastname,birthdate,phone})
        }
        else{
            res.render('client/info',{layout:'./layouts/main'})
        }
       
    })
} 
    
    

})

// Register Client info post
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
        console.log(user.userId)
    }



    if (errors.length > 0) {
        res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})
      }
     else{
        let sql = `SELECT * FROM Client WHERE userId = '${req.session.user.userId}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err)   errors.push({msg:err})

        if(result[0] )
        { 
            let clt = {firstname:firstname,lastname:lastname,
                birthdate:birthdate, phone:phone}
            let sql = `Update Client SET ? WHERE userId = ${req.session.user.userId}`
            let query = mysqlDb.query(sql,clt, (err,result) =>{
                if(err) {  errors.push({msg:err})
                res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})      

            }
                else{req.flash(
                    'success_msg',
                    'Informations updated'
                  )
                  res.redirect('/user/dashboard');     
                }

        })  
        }

        else {
            let clt = {userId:req.session.user.userId,firstname:firstname,lastname:lastname,
                birthdate:birthdate, phone:phone}
            let sql = 'INSERT INTO Client SET ?'
            let query = mysqlDb.query(sql, clt,(err,result) =>{
                if(err) {  errors.push({msg:err})
                res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})
            }
                else{req.flash(
                    'success_msg',
                    'Informations saved'
                  )
                  res.redirect('/user/dashboard');
                }
                        

        })  
        }
        
    })
    
     } 

})

//  Client delivery address get
router.get('/address',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
        let sql = `SELECT idAddress FROM Client WHERE userId = '${req.session.user.userId}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err)   errors.push({msg:err})

        if(result[0].idAddress )
        {
            console.log(result[0])
        let sql = `SELECT * FROM Address WHERE idAddress = '${result[0].idAddress}' `
        let query = mysqlDb.query(sql, (err,adr) =>{
        if(err)   errors.push({msg:err})
        if(adr[0] )
        {
        const street =adr[0].street
        const hausnumber = adr[0].hausNumber
        const postalcode = adr[0].postalCode
        const city = adr[0].city
        const land = adr[0].land

            res.render('client/address',{layout:'./layouts/main',street,hausnumber,postalcode,city,land})
        }
        else{
            res.render('client/address',{layout:'./layouts/main'})
        }
    })
            
        }
        else{
            res.render('client/address',{layout:'./layouts/main'})
        }
       
    })
} 

})


// Client address post
router.post('/address',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }

    const {street,hausnumber,postalcode,city,land} = req.body;
    let errors = [];

    

    // Check required field
    if(!street || !hausnumber || !postalcode || !city|| !land){
        errors.push({msg:'Please fill in all field'});
    }



    if (errors.length > 0) {
        res.render('client/info',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})
      }
     else{
        let sql = `SELECT idAddress FROM Client WHERE userId = '${req.session.user.userId}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err)   errors.push({msg:err})

        if(result[0].idAddress )
        {
            let sql = `SELECT * FROM Address WHERE idAddress = '${result[0].idAddress}' `
        let query = mysqlDb.query(sql, (err,adr) =>{
        if(err)   errors.push({msg:err})
        let adrs = {street:street,hausnumber:hausnumber,
            postalcode:postalcode, city:city,land:land}
        let sql = `Update Address SET ? WHERE idAddress = ${result[0].idAddress}`
        let query = mysqlDb.query(sql,adrs, (err,r) =>{
            if(err) {  errors.push({msg:err})
            res.render('client/address',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})      
        }
            else{req.flash(
                'success_msg',
                'Informations updated'
              )
              res.redirect('/user/dashboard');     
            }
        })

        })

        }

        else {
            let adrs = {street:street,hausnumber:hausnumber,
                postalcode:postalcode, city:city,land:land}
            let sql = 'INSERT INTO Address SET ?'
            let query = mysqlDb.query(sql, adrs,(err,r) =>{
                if(err) {  errors.push({msg:err})
                res.render('client/address',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})      
            }
                else{
                    clt = {idAddress:r.insertId}
            let sql = `Update Client SET ? WHERE userId = ${req.session.user.userId}`
            let query = mysqlDb.query(sql,clt, (err,rs) =>{
                if(err)   errors.push({msg:err})
            }) 
                    req.flash(
                    'success_msg',
                    'Informations saved'
                  )
                  res.redirect('/user/dashboard');
                }
            })
        }           
    })
}
})


module.exports = router