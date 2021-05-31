import { Book } from './book.model'
import {getManager} from "typeorm";

/*
    role = 1 => ADMIN => GET ALL BOOK, GET BOOK BY NAME, ADD NEW BOOK, UPDATE BOOK, DELETE BOOK
    role = 2 => USER LEVEL 1 => GET ALL BOOK, GET BOOK BY NAME, ADD NEW BOOK
    role = 3 => USER LEVEL 2 => GET ALL BOOK, GET BOOK BY NAME, UPDATE BOOK
    role = 4 => USER LEVEL 3 => GET ALL BOOK, GET BOOK BY NAME, DELETE BOOK
    role = 5 => USER LEVEL 4 => GET BOOK BY NAME
*/

export const getAllBook = async (req, res) => {  
    let role = req.role

    if (role == 1 || role == 2 || role == 3 || role == 4) {
        const bookRepository = getManager().getRepository(Book)  
        bookRepository.find()
        .then(books => {
            res.json({code: 200, status: "successed", data: books})
        })
        .catch(err => {
            res.json({code: 400, status: "failed", error: err.message})
        })
    } else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

export const getBookById = async (req, res) => {
    const bookRepository = getManager().getRepository(Book)
    bookRepository.findOne(req.params.id)
    .then(book => {
        res.json({code: 200, status: "successed", data: book})
    })
    .catch(err => {
        res.json({code: 400, status: "failed", error: err.message})
    })
}

export const addNewBook = async (req, res) => {
    let role = req.role

    if (role == 1 || role == 2) {
        let {name, author, description, page} = req.body

        let book = new Book(name, author, description, page)

        const bookRepository = getManager().getRepository(Book)
        bookRepository.save(book)
        .then(result => {
            return res.json({code: 200, status: "successed", data: result})    
        })
        .catch(err => {
            return res.json({code: 400, status: "failed", error: err.message})
        })
    } else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

export const updateBookByID = async (req, res) => {
    let role = req.role

    if (role == 1 || role == 3) {
        let {name, author, description, page} = req.body

        const bookRepository = getManager().getRepository(Book)
        bookRepository.update(req.params.id, {name, author, description, total_page: page})
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
    } else res.json({code: 400, status: "failed", error: "this account do not have permission."})
}

export const deleteBookByID = async (req, res) => {
    let role = req.role

    if (role == 1 || role == 4) {
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
    } else return res.json({code: 400, status: "failed", error: "this account do not have permission."})
}