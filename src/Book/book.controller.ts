import { Book } from './book.model'
import {Request, Response} from "express";
import {getManager} from "typeorm";

// class BookController {
//     public getAllBook(req, res) {
        
//         // const sql = "SELECT * FROM `book`"
//         // conn.query(sql, (err, data) => {
//         //     if (err) return res.json({code: 400, status: "failed", error: err.message})

//         //     let books = JSON.parse(JSON.stringify(data))
//         //     return res.json({code: 200, status: "successed", data: books})
//         // })
        
        
        
//     }

//     public getBookById(req, res) {
//         // let {id} = req.params
        
//         // const sql = "SELECT * FROM `book` WHERE `id` = ?"
//         // conn.query(sql, [id], (err, data) => {
//         //     if (err) return res.json({code: 400, status: "failed", error: err.message})

//         //     let books = JSON.parse(JSON.stringify(data))
//         //     return res.json({code: 200, status: "successed", data: books})
//         // })
//     }

//     public addNewBook(req, res) {
//         let {name, author, description, page} = req.body
//         let date = Date.now()

//         // const sql = "INSERT INTO `book` (`name`, `author`, `description`, `total_page`, `date`) VALUES (?, ?, ?, ?, ?)"
//         // conn.query(sql, [name, author, description, page, date], (err, data) => {
//         //     if (err) return res.json({code: 400, status: "failed", error: err.message})
            
//         //     let result = JSON.parse(JSON.stringify(data))
//         //     if (result.affectedRows == 1) {
//         //         return res.json({code: 200, status: "successed", message: `Inserted with id = ${result.insertId}`, data: result})
//         //     }
//         // })
//     }

//     public updateBookByID(req, res) {
//         // let {name, author, description, page} = req.body
//         // let {id} = req.params
//         // let date = Date.now()        

//         // const sql = "UPDATE `book` SET `name` = ?,`author` = ?,`description` = ?,`total_page`= ?,`date` = ? WHERE `id` = ?"
//         // conn.query(sql, [name, author, description, page, date, id], (err, data) => {
//         //     if (err) return res.json({code: 400, status: "failed", error: err.message})
            
//         //     let result = JSON.parse(JSON.stringify(data))
//         //     if (result.affectedRows == 1) {
//         //         return res.json({code: 200, status: "successed", message: `Changed rows: ${result.changedRows}`, data: result})
//         //     }
//         // })
//     }

//     public deleteBookByID(req, res) {
//         // let {id} = req.params

//         // const sql = "DELETE FROM `book` WHERE `id` = ?"
//         // conn.query(sql, [id], (err, data) => {
//         //     if (err) return res.json({code: 400, status: "failed", error: err.message})
            
//         //     let result = JSON.parse(JSON.stringify(data))
//         //     if (result.affectedRows == 1) {
//         //         return res.json({code: 200, status: "successed", message: `Deleted row with id: ${id}`, data: result})
//         //     }
//         // })
//     }
// }

// export default BookController






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