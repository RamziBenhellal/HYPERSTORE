const express = require('express')
const db = require('./db')

class ArticleService{

    static async  all(){

        let sql = `SELECT * FROM Size `
        const result = await db.query(sql)
    
        return result
    }    

static async find(id){
    
    let sql = `SELECT * FROM Size WHERE idSize =  ${id}`
    const result = await db.query(sql)

    return result[0]

}

}

module.exports = ArticleService