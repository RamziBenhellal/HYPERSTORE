const mysql = require('mysql')

// create connection 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'commag'
})

const connectMysql = async() => { db.connect( (err)=>{
    if(err){
        console.error(err)
        process.exit(1)
    }
    else
    console.log('Mysql connected ...')
})
}
module.exports = { connectMysql,db} 