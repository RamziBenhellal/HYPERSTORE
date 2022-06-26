const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const UserService = require('../service/UserService')

// Dashboard
router.get('/dashboard',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
    res.render('user/dashboard',{layout:'./layouts/main'})
    }

})

// set email and/or password  GET
router.get('/setlogin',async function(req,res){
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
    let email = req.session.user.email
    res.render('user/setlogin',{layout:'./layouts/main',email})
    }

})

// set email and/or password POST
router.post('/setlogin',async function(req,res){
    if(!req.session.authenticated){
        res.redirect('/')
    }
    else{
        const {email,oldpassword, password,password2} = req.body;
        let errors = [];
    
        // Check required field
        if(!email){
            errors.push({msg:'Please fill in email password'});
        }
        if(oldpassword){
            
            const match = await bcrypt.compare(oldpassword, req.session.user.password);
            if(!match) {
                errors.push({msg:'Incorrect old password'});
            }
    
        // Check Password match
        if(password !== password2){
            errors.push({msg:'Passwords do not match'});
        }
    
        
    
        // Check password length
        if(password.length < 6){
            errors.push({msg:'Password should be at least 6 characters'});
        }
    }
    
        if (errors.length > 0) {
            res.render('user/setlogin',{layout:'./layouts/main',errors,email})
          }
        else{
            if(!oldpassword){
            let user = [email]
            let result 
            try {
                result = await UserService.updateEmail(user,req.session.user.userId)
            } catch (err) {
                errors.push({ msg: err })
                res.render('user/setlogin',{layout:'./layouts/main',errors,email})
            }
            if(result)
            {
            req.session.authenticated = false
            req.session.user = null
            req.flash('success_msg','Your email is updated')
            res.redirect('/auth/login');
            }
            else{ req.flash('error_msg','No Informations are saved')}
        }
            else{
                bcrypt.genSalt(10, async function(err, salt)  {
                    bcrypt.hash(password, salt, (err, hash) => {
                      if (err) throw err;
                      let user = [hash]
                      let result
                      try {
                        result = UserService.updatePassword(user,req.session.user.userId)
                      } catch (error) {
                        errors.push({ msg: err })
                        res.render('user/dashboard',{layout:'./layouts/main',errors,email}) 
                      }
                    if(result){
                          req.flash(
                            'success_msg',
                            'Your password is updated'
                          );
                          res.redirect('/user/dashboard');
                    }else{ req.flash('error_msg','No Informations are saved')}
                       
                    });
                  });
            }
              
            }
    }

})
module.exports = router