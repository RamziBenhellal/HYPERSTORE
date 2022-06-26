const express = require('express')
const db = require('./db')

class ArticleService{

static async findAllByIdProduct(id){
    
    let sql = `SELECT * FROM Article WHERE idProduct =  ${id}`
    const result = await db.query(sql)

    return result

}

static async findAllByIdProductIdColor(id, idColor){
    
    let sql = `SELECT * FROM Article WHERE idProduct =  ${id} AND idColor = ${idColor}`
    const result = await db.query(sql)

    return result

}


}

module.exports = ArticleService