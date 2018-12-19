const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfilesSchema = new Schema({
  type: {
    type: String
  },
  describe: {
    type: String,
  },
  income: {
    type: String,
    required: true
  },
  expend: {
    type: String,
    required: true
  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  _del:{
    type: Number,
    default: 0
  }
})

module.exports = Profiles = mongoose.model("profiles", ProfilesSchema)