import { Router } from 'express'
import * as userController from './user.controller'

const router = Router()

router.post('/login', userController.handleLogin)
router.post('/register', userController.handleRegister)
router.post('/active-account', userController.handleActiveAccount)

export default router