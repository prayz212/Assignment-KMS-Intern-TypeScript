import express, { Router } from 'express'
import * as bookController from './book.controller'

const router = Router()

router.get('/',  bookController.getAllBook)
router.get('/:id', bookController.getBookById)
router.post('/add', bookController.addNewBook)
router.put('/update/:id', bookController.updateBookByID)
router.delete('/delete/:id', bookController.deleteBookByID)

export default router