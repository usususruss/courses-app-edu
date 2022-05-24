const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')

const app = express()
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main'
})

// Registering and enabling template engine
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.urlencoded({ extended: false }))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

const DB_USER_NAME = 'user'
const DB_USER_PWD = 'user'
const DB_NAME = 'courses-db'

const CONNECTION_URL = `mongodb://${DB_USER_NAME}:${DB_USER_PWD}@localhost:27017/${DB_NAME}?retryWrites=true&writeConcern=majority`

async function start() {
    try {
        await mongoose.connect(CONNECTION_URL)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.error(e)
        mongoose.disconnect()
    }
}

start()
