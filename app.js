const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// DB config
const db = require('./config/key').mongoURI
// 加载 router
const users = require('./router/api/users')

// 使用 body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
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
const port = process.env.PORT || '5000'

app.listen(port, () => {
  console.log(`the server is running on ${port}`)
})