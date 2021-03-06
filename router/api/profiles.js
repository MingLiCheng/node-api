const express = require('express')
const router = express.Router()
const passport = require('passport')

const Profile = require('../../models/Profile')

// $route GET api/profiles/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.send({
    "msg": 'profiles api is working'
  })
})

// $route GET api/profiles/
// @desc 返回所有数据
// @access private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.find().then(result => {
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

// $route GET api/profiles/:id
// @desc 返回指定id的数据
// @access private
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findById({
    _id: req.params.id
  }).then(result => {
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

// @route  POST api/profiles/add
// @desc   创建信息接口
// @access Private
router.post('/add', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const profileFields = {};

  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  new Profile(profileFields).save().then(profile => {
    res.json(profile);
  });
});

// @route  POST api/profiles/edit
// @desc   更新信息接口
// @access Private
router.post('/edit/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const profileFields = {};

  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  Profile.findOneAndUpdate({
    _id: req.params.id
  }, {
    $set: profileFields
  }, {
    new: true
  }).then(profile => res.json(profile))
});

// @route  POST api/profiles/delete/:id
// @desc   删除信息接口
// @access Private
router.delete('/delete/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  console.log('删除资金记录-->'+ req.params.id);
  Profile.findOneAndDelete({
      _id: req.params.id
    })
    .then(profile => {
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json('删除失败!'));
});


module.exports = router
