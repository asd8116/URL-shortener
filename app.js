const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
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

// routes
app.get('/', (req, res) => {
  res.render('index')
})

// 轉化 Url
app.post('/', (req, res) => {
  const existUrl = []

  const generatorUrl = () => {
    let url = ''
    url += bcrypt.hashSync(`${req.body.name}`, 10).slice(-5)

    return check(url)
  }

  // 防止重複 5碼網址和出現符號('/', '.')
  const check = url => {
    if (existUrl.includes(url, '/', '.')) {
      return generatorUrl()
    } else {
      existUrl.push(url)
      return url
    }
  }

  const newUrl = new Url({
    name: req.body.name,
    key: generatorUrl()
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
