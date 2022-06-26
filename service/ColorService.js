const express = require('express')
const db = require('./db')

class ColorService{

    static async  all(){

        let sql = `SELECT * FROM Color `
        const result = await db.query(sql)
    
        return result
    }    
    static async find(id){
    
    let sql = `SELECT * FROM Color WHERE idColor =  ${id}`
    const result = await db.query(sql)

    return result[0]
    }    

}

module.exports = ColorService