const express = require('express');
const router = express.Router();
const passport = require('passport');
const Food = require('../../models/Food');

// $route GET api/foods/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.send({
    msg: 'The Api Is Running'
  });
});

// $route GET api/foods/
// @desc 返回所有数据
// @access private
router.get('/', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Food.find().then(result => {
      if (!result) {
        res.status(404).json('没有内容');
      } else {
        res.json({
          code: 0,
          result
        });
      }
    });
  }
);


// @route  POST api/foods/add
// @desc   创建信息接口
// @access Private
router.post( '/add', passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    console.log(req.body)
    const foodFields = {};
    if (req.body.type) foodFields.type = req.body.type;
    if (req.body.describe) foodFields.describe = req.body.describe;
    if (req.body.name) foodFields.name = req.body.name;
    if (req.body.price) foodFields.price = req.body.price;
    if (req.body.imgpath) foodFields.imgpath = req.body.imgpath;
    new Food(foodFields).save().then(food => {
      res.json(food);
    })
  }
);

module.exports = router;
