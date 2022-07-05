const express = require('express')
const db = require('./db')

class OrderService{
    static async insert(order){


        let sql = `INSERT INTO commag.Order(idOrder,idClient,totalPrice,status) VALUES (?,?,?,?)`
        const result = await db.query(sql,order)
    
        if(result.affectedRows > 0){
            return true
        }
        return false
    
    }
    
    static async insertArticleIntoOrder(data){
    
    
        let sql = `INSERT INTO Order_article (idOrder,idArticle,articleQuantity,totalPrice) VALUES (?,?,?,?)`
        const result = await db.query(sql,data)
    
        if(result.affectedRows > 0){
            return true
        }
        return false
    
    }
    
    static async findByUserId(id){
        let sql = `SELECT * FROM Order WHERE clientId = (select clientId from Client WHERE userId = ${id}) `
        const result = await db.query(sql)
    
        return result[0]
    }
    
    static async getArticles(idOrder){
    
        let sql = `select * FROM order_article Join article on order_article.idArticle = article.idArticle AND order_article.idOrder = ${idOrder}`
        const result = await db.query(sql)
    
        return result
    }

}

module.exports = OrderService