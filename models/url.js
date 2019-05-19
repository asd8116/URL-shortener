const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Url', urlSchema)
