import {Request, Response, NextFunction, Router} from 'express'
import Controller from '../interfaces/controller.interface'
// import bookModel from './book.model'

class BookController implements Controller {
    public path = '/books'
    public router = Router()
    // private book = bookModel

    constructor() {
        this.initRoutes()
    }

    private initRoutes() {
        this.router.get(`${this.path}/`, this.getAllBook)
        this.router.get(`${this.path}/:name`, this.getBookByName)
        this.router.post(`${this.path}/add`, this.addNewBook)
        this.router.put(`${this.path}/update/:name`, this.updateBook)
        this.router.delete(`${this.path}/delete/:name`, this.deleteBook)
    }

    private getAllBook = async (request: Request, response:  Response) => {
        //call query function in model 
    }

    private getBookByName = async (request: Request, response: Response) => {

    }

    private addNewBook = async (request: Request, response: Response) => {

    }

    private updateBook = async (request: Request, response: Response) => {

    }

    private deleteBook = async (request: Request, response: Response) => {

    }
}