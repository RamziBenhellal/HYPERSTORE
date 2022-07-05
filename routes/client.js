const express = require('express')
const AddressService = require('../service/AddressService')
const router = express.Router()
const clientService = require('../service/ClientService')



// Register Client info get
router.get('/info',async function(req,res){
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
        
        try {
        
        let client = await clientService.findByUserId(req.session.user.userId)
       

        if(client )
        {
            const firstname =client.firstname
            const lastname = client.lastname
            const birthdate = client.birthdate
            const phone = client.phone

            res.render('client/info',{layout:'./layouts/main',firstname,lastname,birthdate,phone})
        }
        else{
            res.render('client/info',{layout:'./layouts/main'})
        }
    } catch (err) {
        errors.push({msg:err});
        next(err);
    }
       
    
} 
    
    

})

// Register Client info post
router.post('/info',async function(req,res,next){
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
        let client
        try {
        client = await clientService.findByUserId(req.session.user.userId)
    } catch (err) {
        errors.push({msg:err});
        next(err);
    }

        if(client )
        { 
            let clt  = [firstname,lastname,birthdate,phone]
            let result
            try{    
            result = await clientService.updateByUserId(clt,req.session.user.userId)
            if(result){req.flash('success_msg','Informations updated')
              res.redirect('/user/dashboard');}
            else{ req.flash('error_msg','No Informations are saved')}  
            }
            catch(err){
                 errors.push({msg:err})
                res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})
            }      

            }

        else {
            let clt  = [req.session.user.userId,firstname,lastname,birthdate,phone]
            let result
            try{    
            result = await clientService.insert(clt)
            if(result){req.flash('success_msg','Informations updated')
              res.redirect('/user/dashboard');}
            else{ req.flash('error_msg','No Informations are saved')}  
            }
            catch(err){
                 errors.push({msg:err})
                res.render('client/info',{layout:'./layouts/main',errors,firstname,lastname,birthdate,phone})
            }      

            }
 
     } 

})

//  Client delivery address get
router.get('/address',async function(req,res,next){
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
        let client
        try {
        client = await clientService.findByUserId(req.session.user.userId)
    } catch (err) {
        errors.push({msg:err});
        next(err);
    }

        if(client.idAddress )
        {
        let address
        try {
        address = await AddressService.findById(client.idAddress)
        } catch (err) {
        errors.push({msg:err});
        next(err);
           }


        if(address )
        {
        const street = address.street
        const hausnumber = address.hausNumber
        const postalcode = address.postalCode
        const city = address.city
        const land = address.land

            res.render('client/address',{layout:'./layouts/main',street,hausnumber,postalcode,city,land})
        }
        else{
            res.render('client/address',{layout:'./layouts/main'})
        }
    
        }
        else{
            res.render('client/address',{layout:'./layouts/main'})
        }
       
    
} 

})


// Client address post
router.post('/address',async function(req,res){
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
        res.render('client/address',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})
      }
     else{
        let client
        try {
        client = await clientService.findByUserId(req.session.user.userId)
    } catch (err) {
        errors.push({msg:err});
        next(err);
    }

   

        if(client.idAddress )
        {
            
            let address  = [street,hausnumber,postalcode,city,land]
            let result
            try{
               
            result = await AddressService.update(address,client.idAddress)
            if(result){req.flash('success_msg','Informations updated')
              res.redirect('/user/dashboard');}
            else{ req.flash('error_msg','No Informations are saved')}  
            }
            catch(err){
                 errors.push({msg:err})
                res.render('client/address',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})
            }

        }

        else {
            let address  = [street,hausnumber,postalcode,city,land]
            let result 
            try{    
            result = await AddressService.insert(address,req.session.user.userId)
           
            if(result){
                
              req.flash('success_msg','Informations updated')
              res.redirect('/user/dashboard');
            }
            else{ req.flash('error_msg','No Informations are saved')}
        }
            catch(err){
                 errors.push({msg:err})
                res.render('client/address',{layout:'./layouts/main',errors,street,hausnumber,postalcode,city,land})
            }  
        }           
   
}
})


module.exports = router