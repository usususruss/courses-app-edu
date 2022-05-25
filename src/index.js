const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')

const User = require('./models/user')

const app = express()
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main'
})

// Registering and enabling template engine
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.urlencoded({ extended: false }))

app.use(async (req, _res, next) => {
    try {
        const id = '628de96ff878c39a575419a3' // Hardcode!
        const user = await User.findById(id)
        req.user = user
        next()
    } catch (e) {
        console.error(e)
    }
})

app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cardRoutes)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000

const DB_USER_NAME = 'user'
const DB_USER_PWD = 'user'
const DB_NAME = 'courses-db'

const CONNECTION_URL = `mongodb://${DB_USER_NAME}:${DB_USER_PWD}@localhost:27017/${DB_NAME}`

async function start() {
    try {
        await mongoose.connect(CONNECTION_URL)

        const candidate = await User.findOne().lean()
        if (!candidate) {
            const user = new User({
                email: 'test@test.com',
                name: 'test',
                cart: { items: [] }
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.error(e)
        mongoose.disconnect()
    }
}

start()
