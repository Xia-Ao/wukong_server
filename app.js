const path = require('path');
var http = require('http');
const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const index = require('./src/routes/index')
const users = require('./src/routes/users')
const branch = require('./src/routes/branch')

const config = require('./config');
const { normalizePort, onError, onListening} = require('./bin/binUtil');

const app = new Koa();

// session存储配置
const sessionMySqlConfig = {
  user: config.database.USER,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
};

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMySqlConfig),
}))

// error handler
onerror(app)


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
// app.use(views(path.join)(__dirname + '/views'), {
//   extension: 'ejs',
// })

app.use(views(__dirname + '/src/views', {
  extension: 'ejs'
}))

// 使用ctx.body解析中间件
app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(branch.routes(), branch.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// 监听启动端口
var server = http.createServer(app.callback());
server.listen(normalizePort(config.port));
console.log(`the server is start at port ${config.port}`);


// module.exports = app
