const LocalStrategy = require('passport-local').Strategy
const mysqlDb = require('../config/db').db
const bcrypt = require('bcryptjs')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({emailField: 'email'}, (email,password,done)=>{
            //Match user
            let sql = `SELECT * FROM User WHERE email = '${email}' `
            let query = mysqlDb.query(sql, (err,result) =>{
                if(err)   throw err
                if(!result[0] ){ 
                    return done(null,false, {message: 'That email is not registred'})
                }
                bcrypt.compare(password,result[0].password,(err,isMatch) =>{
                    if(err) throw err
                    if(isMatch){
                        return done(null,result[0])
                    }else{
                        return done(null,false, {message: 'Password is incorrect'}) 
                    }

                })
            })
        })
    )

  

}