const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const candidate = await User.findOne({ email })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) throw err

                    res.redirect('/')
                })
            } else {
                req.flash('errorLogin', 'Bad credentials')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('errorLogin', 'User does not exist')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.error(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirm, name } = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('errorRegister', 'User with such email already exists!')
            res.redirect('/auth/login#register')
        } else {
            if (password !== confirm) {
                req.flash('errorRegister', 'Passwords are mismatching!')
                return res.redirect('/auth/login#register')
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: { items: [] }
            })

            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.error(e)
    }
})

module.exports = router
