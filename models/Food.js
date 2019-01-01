const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const FoodSchema = new Schema({
  type: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  describe: {
    type: String,
  },
  price: {
    type: String,
    required: true
  },
  imgpath: {
    type: String,
    default: "/upload/foodsimage/111.jpg"
  },
  c_date: {
    type: Date,
    default: Date.now
  },
  u_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = food = mongoose.model("food", FoodSchema)
