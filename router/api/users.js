const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar') // 全球公认头像

const User = require('../../models/User')

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.send({
    "msg": 'test'
  })
})

// $route POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  // console.log(req.body);
  // 首先查询数据库中是否有这个邮箱
  User.findOne({
      email: req.body.email
    })
    .then((user) => {
      if (user) {
        return res.status(400).json({
          email: "邮箱已被注册"
        })
      } else {
        var avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        })
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => res.json(user)).catch(err => console.log(err))
          })
        })
      }
    })



})

// $route POST api/users/login
// @desc 返回的请求的json数据 token jwt(json web token) passport
// @access public

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          msg: "用户不存在"
        })
      } else {
        // 用户存在 进行密码匹配
        // bcrypt.compare(password,user.password,(err, res) => {})
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              res.json({
                msg: "success"
              })
            } else {
              return res.status(400).json({
                msg: "密码错误"
              })
            }
          })
      }
    })
})

module.exports = router