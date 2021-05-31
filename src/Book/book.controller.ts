import { Book } from './book.model'
import {Request, Response} from "express";
import {getManager} from "typeorm";

export const getAllBook = async (req: Request, res: Response) => {  
    const bookRepository = getManager().getRepository(Book)  
    bookRepository.find()
    .then(books => {
        res.json({code: 200, status: "successed", data: books})
    })
    .catch(err => {
        res.json({code: 400, status: "failed", error: err.message})
    })
}

export const getBookById = async (req: Request, res: Response) => {
    const bookRepository = getManager().getRepository(Book)
    bookRepository.findOne(req.params.id)
    .then(book => {
        res.json({code: 200, status: "successed", data: book})
    })
    .catch(err => {
        res.json({code: 400, status: "failed", error: err.message})
    })
}

export const addNewBook = async (req: Request, res: Response) => {
    let {name, author, description, page} = req.body
    let date = Date.now()

    let book = new Book(name, author, description, page, date)

    const bookRepository = getManager().getRepository(Book)
    bookRepository.save(book)
    .then(result => {
        console.log(result)
        return res.json({code: 200, status: "successed"})    
    })
    
}

export const updateBookByID = async (req: Request, res: Response) => {
    let {name, author, description, page} = req.body
    let date = Date.now()

    const bookRepository = getManager().getRepository(Book)
    bookRepository.update(req.params.id, {name, author, description, total_page: page, date})
    .then(result => {
        if (result.affected == 1) {
            return res.json({code: 200, status: "successed", data: result.raw})
        } else if (result.affected == 0) {
            return res.json({code: 409, status: "failed", error: "don't have any row match this book id."})
        }
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

export const deleteBookByID = async (req: Request, res: Response) => {
    const bookRepository = getManager().getRepository(Book)
    bookRepository.findOne(req.params.id)
    .then(book => {
        if (book) return bookRepository.remove(book)
        else throw new Error("don't have any row match this book id.")
    })
    .then(result => {
        if (result) return res.json({code: 200, status: "successed"})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}