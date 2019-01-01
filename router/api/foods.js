const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const keys = require('../../config/key')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const Food = require('../../models/Food')
var multer = require('multer')
var upload = multer({
  dest: 'upload/foodsimage'
})
const fs = require('fs');
const UPLOAD_PATH = '../../upload/foodsimage'

// $route GET api/foods/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.send({
    "msg": 'The Api Is Running'
  })
})

// $route GET api/foods/
// @desc 返回所有数据
// @access private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Food.find().then(result => {
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

// 文件上传
router.post('/upload', upload.single('fileUpload'), function (req, res, next) {
  console.log(req);
   res.json({
     code: '0'
   });
})

// @route  POST api/foods/add
// @desc   创建信息接口
// @access Private
router.post('/add', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const foodFields = {};

  if (req.body.type) foodFields.type = req.body.type;
  if (req.body.describe) foodFields.describe = req.body.describe;
  if (req.body.name) foodFields.name = req.body.name;
  if (req.body.price) foodFields.price = req.body.price;
  if (req.body.cash) foodFields.cash = req.body.cash;
  if (req.body.remark) foodFields.remark = req.body.remark;

  new Profile(profileFields).save().then(profile => {
    res.json(profile);
  });
});

module.exports = router
