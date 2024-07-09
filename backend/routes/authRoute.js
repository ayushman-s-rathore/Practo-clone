import express from 'express'
import { Login, Logout, Register } from '../controllers/user.js'

const router=express.Router()

router.route('/login').post(Login)
router.route('/register').post(Register)
router.route('/logout').get(Logout)

export default router