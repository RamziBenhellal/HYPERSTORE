const express = require('express')
const db = require('./db')

class CartService{


static async insert(cart){


    let sql = `INSERT INTO Cart(userId) VALUES (?)`
    const result = await db.query(sql,cart)

    if(result.affectedRows > 0){
        return true
    }
    return false

}

static async insertArticleIntoCart(data){


    let sql = `INSERT INTO Cart_article (idCart,idArticle,articleQuantity,totalPrice) VALUES (?,?,?,?)`
    const result = await db.query(sql,data)

    if(result.affectedRows > 0){
        return true
    }
    return false

}

static async findByUserId(id){
    let sql = `SELECT * FROM Cart WHERE userId =  ${id}`
    const result = await db.query(sql)

    return result[0]
}

static async getArticles(idCart){

    let sql = `select * FROM cart_article Join article on cart_article.idArticle = article.idArticle AND cart_article.idCart = ${idCart}`
    const result = await db.query(sql)

    return result
}

static async articleNumbre(userId){

    let sql = `select sum(articleQuantity) as sum FROM cart_article WHERE idCart = (select idCart FROM Cart WHERE userId = ${userId}) `
    const result = await db.query(sql)

    return result[0]
}




}

module.exports = CartService