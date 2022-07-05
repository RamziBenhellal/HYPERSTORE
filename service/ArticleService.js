const express = require('express')
const db = require('./db')

class ArticleService{

    static async find(id){
        let sql = `SELECT * FROM Article WHERE idArticle =  ${id}`
        const result = await db.query(sql)
    
        return result[0]
    }

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

static async findByIdProductIdColorIdSize(id, idColor,idSize){
    
    let sql = `SELECT * FROM Article WHERE idProduct =  ${id} AND idColor = ${idColor} AND idSize = ${idSize} `
    const result = await db.query(sql)

    return result[0]

}


}

module.exports = ArticleService