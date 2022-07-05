const db = require('./db')



class UserService {
    static async getAll() {
        let sql = `SELECT * FROM User `
        const result = await db.query(sql)
    
        return result
    }

    static async find(email) {

        let sql = `SELECT * FROM User WHERE email = '${email}' `
        const result = await db.query(sql)

        return result[0]
        }

    static async insert(email,password) {
        let sql = `INSERT INTO User(email,password) VALUES (?,?)`
        let user = [email,password]
        const result = await db.query(sql,user)

        let sql2 = `INSERT INTO Cart(userId) VALUES (${result.insertId})`
        const result2 = await db.query(sql2)
    
        if(result.affectedRows > 0 && result2.affectedRows){
            return true
        }
        return false
    }

    static async updateEmail(user,id){
        let sql = `Update User SET email = ?  WHERE userId = ${id}`
        const result = await db.query(sql,user)
        
    
        if(result.affectedRows > 0){
            return true
        }
        return false
    
    }

    static async updatePassword(user,id){
        let sql = `Update User SET password = ?  WHERE userId = ${id}`
        const result = await db.query(sql,user)
        
    
        if(result.affectedRows > 0){
            return true
        }
        return false
    
    }

    
   
}

module.exports = UserService;
