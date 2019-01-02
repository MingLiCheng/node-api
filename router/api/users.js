const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar') // 全球公认头像
const keys = require('../../config/key')
const jwt = require('jsonwebtoken')
const passport = require('passport')

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
  console.log(req.body);
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

// $route GET api/users/
// @desc 返回所有数据
// @access private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  User.find().then(result => {
    if (!result) {
      res.status(404).json('没有内容')
    } else {
      res.json({
        "code": 0,
        result
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
  console.log('email:' + email + '--' + 'password:' + password)

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
              // jwt.sign("规则","加密的名字","过期时间","回掉")
              const rule = {
                id: user.id,
                name: user.name,
                identity: user.identity
              }
              jwt.sign(rule, keys.secretOrKey, {
                expiresIn: 3600
              }, (err, token) => {
                if (err) throw err
                res.json({
                  success: true,
                  token: "Bearer " + token
                })
              })
              // res.json({ msg: "success" })
            } else {
              return res.status(400).json({
                msg: "密码错误"
              })
            }
          })
      }
    })
})

// $route GET api/users/current
// @desc 返回的请求的json数据 current user
// @access Private 需要token
// router.get('/current','验证token',(req,res) => { res.json({"msg":""})})
router.get('/current', passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  // res.json(req.user)
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

// @route  Delete api/users/delete/:id
// @desc   删除信息接口
// @access Private
router.delete('/delete/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  console.log('删除用户-->' + req.params.id);
  User.findOneAndDelete({
      _id: req.params.id
    })
    .then(user => {
      user.save().then(user => res.json(user));
    })
    .catch(err => res.status(404).json('删除失败!'));
})

// $route GET api/users/:email
// @desc 返回的请求的json数据 判断邮箱是否存在
// @access public 需要token
router.get('/:email', (req, res) => {
  console.log('用户名验证')
  User.findOne({
    email: req.params.email
  }).then(result => {
    if (result) {
      // console.log(1);
      res.json({
        msg: 1
      })
    } else {
      res.json({
        msg: 0
      })

    }
  })
})


// @route  POST api/users/edit
// @desc   更新信息接口
// @access Private
router.post('/edit/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const userFields = {};

  if (req.body.name) userFields.name = req.body.name;
  if (req.body.password) userFields.password = req.body.password;

  User.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: userFields
  }, {
    new: true
  }).then(user => res.json(user))
});


module.exports = router
