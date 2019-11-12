const mysql = require('mysql');

let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:'3306',
    database:'day9zy'
})

connection.connect((error)=>{
    if(error){
        console.log("连接失败")
    }else{
        console.log("连接成功")
    }
})

module.exports = connection