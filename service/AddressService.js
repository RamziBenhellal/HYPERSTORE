const db = require('./db')

class AddressService{

    static async  all(){

        let sql = `SELECT * FROM Address `
        const result = await db.query(sql)
    
        return result
    }

    static async findById(id){
        let sql = `SELECT * FROM Address WHERE idAddress =  ${id}`
        const result = await db.query(sql)
    
        return result[0]
    }

    static async findByUserId(id){
        
        let sql = `SELECT * FROM Address WHERE Address.idAddress = (select idAddress FROM Client WHERE Client.userId = ${id})`
        let sql2 = `SELECT * FROM Address JOIN Client ON Address.idAddress = Client.idAddress AND Client.userId = ${id}`
        const result = await db.query(sql2)
    
        return result[0]
    }

    static async insert(address,id){
        let sql = `INSERT INTO Address(street,hausNumber,postalCode,city,land) VALUES (?,?,?,?,?)`
        const result = await db.query(sql,address)
        let sql2 = `Update Client SET idAddress = ${result.insertId} WHERE userId = ${id}`
       const result2 = await db.query(sql2)
    
        if(result.affectedRows > 0 && result2.affectedRows > 0){
            return true
        }
        return false
    
    }

    static async update(address,id){
        let sql = `Update Address SET street = ? , hausNumber = ? , postalCode = ? , city = ? , land = ? WHERE idAddress = ${id}`
        const result = await db.query(sql,address)
        
    
        if(result.affectedRows > 0){
            return true
        }
        return false
    
    }

}

module.exports = AddressService
