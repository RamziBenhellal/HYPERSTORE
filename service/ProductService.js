const db = require('./db')

class ProductService {

static async  all(){

    let sql = `SELECT * FROM Product `
    const result = await db.query(sql)

    return result
}

static async find(id){
    let sql = `SELECT * FROM Product WHERE idProduct =  ${id}`
    const result = await db.query(sql)

    return result[0]
}

}





module.exports = ProductService