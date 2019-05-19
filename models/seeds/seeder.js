const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Url = require('../url')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urls', {
  useNewUrlParser: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  Url.create({
    name: 'https://www.facebook.com/',
    key: bcrypt.hashSync(`https://www.facebook.com/`, 10).slice(-5)
  })

  console.log('done')
})
