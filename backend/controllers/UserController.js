const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        //Validations
        if (!name) {
            res.status(422).json({ message: '!O nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: '!o email é obrigatório!' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: '!O telefone é obrigatório!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: '!A senha é obrigatória!' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: '!A confirmação da senha é obrigatória!' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: '!A senha e a confirmação da senha não são iguas!' })
            return
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: '!Usuário já cadastrado!' })
            return
        }

        //Create password
        const salt = await bcrypt.genSalt(12) //12 char a mais
        const passwordHash = await bcrypt.hash(password, salt)

        //Create User
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async login(req, res) {

        const { email, password } = req.body

        if (!email) {
            res.status((422)).json({ message: '!O email é obrigatório!' })
            return

        } else if (!password) {
            res.status((422)).json({ message: '!A senha é obrigatória!' })
            return
        }

        //Check if user exists
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({
                message: '!Usuário inexistente no banco de dados!'
            })
            return
        }

        //Check Password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({
                message: '!Senha invalida!'
            })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        //console.log(req.headers.authorization)

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret') //Decode token

            currentUser = await User.findById(decoded.id)
            /*
            Extract data from user /helpers/create-user-token.js based in "id"
            setted on jwt.sign
            */

            currentUser.password = undefined //Hidden password
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        
        //Verify if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' })
            return
        }
        
        //Get user by id                Dont take password                     
        const user = await User.findById(id).select('-password')
        
        if (!user) {
            res.status(422).json({
                message: '!Usuário não encontrado!'
            })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {

        const id = req.params.id

        const { name, email, phone, password, confirmpassword } = req.body

        //Check if user exists by token
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!user) {
            res.status(422).json({
                message: '!Usuário não encontrado!'
            })
            return
        }

        if (req.file) {
            user.image = req.file.filename
        }

        //Validations
        if (!name) {
            res.status(422).json({ message: `O nome é Obrigatório` })
            return

        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: `O email é Obrigatório` })
            return
        }

        //Checando para user nao subscrever email ja cadastrado no sistema 
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({
                message: '!Por favor ultilize outro e-mail!'
            })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: '!O telefone é obrigatório' })
            return
        }

        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: '!As senhas não conferem!' })
            return
        } else if (password === confirmpassword && password != null) {

            //Create crypt password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            //Return user updated data
            await User.findOneAndUpdate(
                { _id: user._id }, //Update by id
                { $set: user }, //Param for data 
                { new: true } //Param update 
            )

            res.status(200).json({ message: '!Usuário atualizado!' })

        } catch (err) {
            res.status(500).json({ message: err })
            return
        }

    }

}