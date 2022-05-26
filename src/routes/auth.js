const { Router } = require('express')
const User = require('../models/user')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    const id = '628de96ff878c39a575419a3' // Hardcode!
    const user = await User.findById(id)

    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => {
        if (err) throw err

        res.redirect('/')
    })
})

router.post('/register', async (req, res) => {})

module.exports = router
