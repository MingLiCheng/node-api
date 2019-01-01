const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')
const path = require('path')

// DB config
const db = require('./config/key').mongoURI
// 加载 router
const users = require('./router/api/users')
const profiles = require('./router/api/profiles')
const foods = require('./router/api/foods')

app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/upload', express.static(path.join(__dirname, './upload')))
// 使用 body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 初始化 passport
app.use(passport.initialize())

// 配置 把passport 传递到 passport.js文件中
require('./config/passport')(passport)

// connect to db
mongoose.connect(db, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('mongoDB Connected');
  }).catch((err) => {
    console.log(err);
  })



app.get('/', (req, res) => {
  res.send('Hello world')
})

// 使用 router
app.use('/api/users', users)
app.use('/api/profiles', profiles)
app.use('/api/foods', foods)

const port = process.env.PORT || '5000'

app.listen(port, () => {
  console.log(`the server is running on ${port}`)
})
