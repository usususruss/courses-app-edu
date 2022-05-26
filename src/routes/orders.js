const { Router } = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')

const router = Router()

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user').lean()

        res.render('orders', {
            isOrders: true,
            title: 'Orders',
            orders: orders.map(o => ({
                ...o,
                price: o.courses.reduce((total, item) => item.count * item.course.price + total, 0)
            }))
        })
    } catch (e) {
        console.error(e)
    }
})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId')
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: i.courseId.toJSON()
        }))

        const order = new Order({
            user: req.user._id,
            courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (e) {
        console.error(e)
    }
})

module.exports = router
