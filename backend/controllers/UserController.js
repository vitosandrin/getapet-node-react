const User = require('../models/User')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        //Validations
        if (!name) {
            res.status(422).json({ message: `!O nome é obrigatório!` })
            return

        } else if (!email) {
            res.status(422).json({ message: `!o email é obrigatório!` })
            return

        } else if (!phone) {
            res.status(422).json({ message: `!O telefone é obrigatório!` })
            return

        } else if (!password) {
            res.status(422).json({ message: `!A senha é obrigatória!` })
            return

        } else if (!confirmpassword) {
            res.status(422).json({ message: `!A confirmação da senha é obrigatória!` })
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
    }
}