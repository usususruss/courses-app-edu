const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const scrf = require('csurf')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongodb-session')(session)

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')

const PORT = process.env.PORT || 3000
const DB_USER_NAME = 'user'
const DB_USER_PWD = 'user'
const DB_NAME = 'courses-db'
const MONGODB_URI = `mongodb://${DB_USER_NAME}:${DB_USER_PWD}@localhost:27017/${DB_NAME}`

const app = express()
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main'
})
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

// Registering and enabling template engine
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        secret: 'some-secret-value',
        resave: false,
        saveUninitialized: false,
        store
    })
)
app.use(scrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)

async function start() {
    try {
        await mongoose.connect(MONGODB_URI)

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.error(e)
        mongoose.disconnect()
    }
}

start()
