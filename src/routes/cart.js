const { Router } = require('express')
const Course = require('../models/course')

const router = Router()

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId.toJSON(),
        id: c.courseId.id,
        count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, c) => c.price * c.count + total, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)

    res.redirect('/cart')
})

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId')
    const courses = mapCartItems(user.cart)

    res.render('cart', {
        title: 'Cart',
        isCard: true,
        courses,
        price: computePrice(courses)
    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user.populate('cart.items.courseId')
    const courses = mapCartItems(user.cart)
    const cartView = {
        price: computePrice(courses),
        courses
    }

    res.status(200).json(cartView)
})

module.exports = router
