const User = require('../model/User');
const mysqlDb = require('../config/db').db;


class UserService {
    static async getAll() {
        return new Promise(async (resolve) => {
            try {
                const [, db] = await mysqlDb.connect();
                if (db == null) {
                    resolve(false);
                    return;
                }

                const [result] = await db.execute('SELECT * FROM User');
                resolve(result);
            } catch (e) {
                console.error(e);
                resolve(null);
            }
        });
    }

    static async get(email,password) {
            try {
                const [, db] = await mysqlDb.connect();
                if (db == null) {
                    resolve(false);
                    return;
                }
                const [result] = await db.execute(`SELECT * FROM User WHERE email = ${email} AND password = ${password}`);
                return new User(result[0],result[1],result[2]);
            } catch (e) {
                console.error(e);
            }
        }

    static save(email,password) {
        let usr = {email:email,password:password}
        let sql = 'INSERT INTO User SET ?'
        let query = mysqlDb.query(sql,usr, (err,result) =>{
        if(err) throw err;
        }) 
    }

    static find(email) {
        
        let sql = `SELECT * FROM User WHERE email = '${email}' `
        let query = mysqlDb.query(sql, (err,result) =>{
        if(err) throw err;
        query._results = result;
        })
        
        return query._results

    }

   
}

module.exports = UserService;
