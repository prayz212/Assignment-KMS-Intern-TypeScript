import { Router } from 'express'
import * as bookController from './book.controller'
import { middleware as checkPermission } from '../Middlewares/permission.middlewares'

const router = Router()

router.get('/', checkPermission, bookController.getAllBook)
router.get('/:id', bookController.getBookById)
router.post('/', checkPermission, bookController.addNewBook)
router.put('/update/:id', checkPermission, bookController.updateBookByID)
router.delete('/delete/:id', checkPermission, bookController.deleteBookByID)

export default router