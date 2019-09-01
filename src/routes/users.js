const router = require('koa-router')();
const userController = require('../controllers/user');

// const mysql = require('mysql')
// const connection = mysql.createConnection({
//   host: '47.98.158.198',   // 数据库地址
//   user: 'root',    // 数据库用户
//   password: '223137',   // 数据库密码
//   database: 'wukong',  // 选中数据库
// })

router.prefix('/users');

router
  .post('/register', userController.register)
  .post('/login', userController.signIn);



module.exports = router
