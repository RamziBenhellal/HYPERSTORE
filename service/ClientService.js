const db = require('./db')
class ClientService{

static async  all(){

    let sql = `SELECT * FROM Client `
    const result = await db.query(sql)

    return result
}

static async findById(id){
    let sql = `SELECT * FROM Client WHERE idClient =  ${id}`
    const result = await db.query(sql)

    return result[0]
}

static async findByUserId(id){
    let sql = `SELECT * FROM Client WHERE userId =  ${id}`
    const result = await db.query(sql)

    return result[0]
}



static async updateByUserId(client,id){
    let sql = `Update Client SET firstname = ? , lastname = ? , birthdate = ? , phone = ? WHERE userId = ${id}`
    const result = await db.query(sql,client)
    

    if(result.affectedRows > 0){
        return true
    }
    return false

}

static async insert(client){
    let sql = `INSERT INTO Client(userId,firstname,lastname,birthdate,phone) VALUES (?,?,?,?,?)`
    const result = await db.query(sql,client)

    if(result.affectedRows > 0){
        return true
    }
    return false

}

}

module.exports = ClientService