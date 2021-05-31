import { User } from './user.model'
import { Code } from './active-code.model'
import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodeMailer from 'nodemailer'
import * as dotenv from 'dotenv'

dotenv.config()
const PRIVATE_KEY = process.env.PRIVATE_KEY
const EMAIL = process.env.EMAIL
const PWD = process.env.PASSWORD
const SALT_ROUNDS = 12

export const handleLogin = async (req: Request, res: Response) => {
    let {username, password} = req.body
    let data = undefined

    const userRepository = getManager().getRepository(User)
    userRepository.findOne({username})
    .then(user => {
        if (user) {
            data = user
            if (!data.active) throw new Error("please active your account first.")
            else return bcrypt.compare(password, user.password)
        } else if (!user) throw new Error("username or password is not correct.")
    })
    .then(match => {
        if (match) {
            const token = jwt.sign({id: data.employee_id, role: data.role}, PRIVATE_KEY, {expiresIn: 10*60})
            return res.json({code: 200, status: "successed", token})
        } else if (!match) throw new Error("username or password is not correct.")
    })
    .catch(err => {
        return res.json({code: 404, status: "failed", error: err.message})
    })
}

export const handleRegister = async (req: Request, res: Response) => {
    let {id, username, password, fullname, age, title, email, role} = req.body

    bcrypt.genSalt(SALT_ROUNDS)
    .then(salt => {
        return bcrypt.hash(password, salt)
    })
    .then(hashed => {
        let user = new User(id, username, hashed, fullname, age, title, email, role)

        const userRepository = getManager().getRepository(User)
        return userRepository.save(user)
    })
    .then(saveUserResult => {
        if (saveUserResult) {
            let activeCode = new Code(saveUserResult.email)
            const codeRepository = getManager().getRepository(Code)
            return codeRepository.save(activeCode)
        }
    })
    .then(result => {
        sendMail(result.email, result.code)
        return res.json({code: 201, status: "successed", message: "Please check your mail to active your account."})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})
    })
}

export const handleActiveAccount = async (req: Request, res: Response) => {
    let {code, email} = req.body

    const codeRepository = getManager().getRepository(Code)
    const userRepository = getManager().getRepository(User)

    codeRepository.findOne({code, email})
    .then(data => {
        return data.createAt
    })
    .then(exp => {
        return isExpired(exp)
    })
    .then(result => {
        if (result) { //expire
            throw new Error("this activate code is expired.")
        } else { //not expire
            return userRepository.findOne({email})
        }
    })
    .then(user => {
        user.active = true
        return userRepository.save(user)
    })
    .then(user => {
        return res.json({code: 200, status: "successed", data: user})
    })
    .catch(err => {
        return res.json({code: 400, status: "failed", error: err.message})        
    })
}

let sendMail = (toEmail, activeCode) => {
    const sender = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PWD
        }
    })

    const mail = {
        from: EMAIL,
        to: `${toEmail}`,
        subject: "Activate your KMS account",
        text: `This is your active code: ${activeCode}. It will expire after 10 minutes.`
    }

    sender.sendMail(mail, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info.accepted);
        }
    })
}

let isExpired = (date) => {
    const now = Date.now()
    const createAt = Date.parse(date)

    let timeRemaining = now - createAt
    return timeRemaining > 600000
}