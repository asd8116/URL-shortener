const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const mongoose = require('mongoose')
const Url = require('./models/url')

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urls', {
  useNewUrlParser: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// routes
app.get('/', (req, res) => {
  res.render('index')
})

// 轉化 Url
app.post('/', (req, res) => {
  const newUrl = new Url({
    name: req.body.name,
    key: bcrypt.hashSync(`${req.body.name}`, 10).slice(-5)
  })

  newUrl
    .save()
    .then(user => {
      console.log(newUrl.key)
      res.redirect(`/urls/${newUrl.key}`)
    })
    .catch(err => console.log(err))
})

app.get('/urls/:key', (req, res) => {
  Url.findOne({ key: req.params.key }, (err, url) => {
    if (err) return console.error(err)
    newUrl = 'localhost:3000/urls/' + url.key

    return res.render('new', { url, newUrl })
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running: localhost:3000')
})
