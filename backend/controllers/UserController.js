const User = require('../models/User')

module.exports = class UserController {
    static async register(req, res) {
        res.json('Olá Get a Pet')
        const { name, email, phone, password, confirmpassword } = req.body

        //Validations
        if (!name) {
            res.status(422).json({ message: `O nome é Obrigatório` })
            return

        } else if (!email) {
            res.status(422).json({ message: `O email é Obrigatório` })
            return

        } else if (!phone) {
            res.status(422).json({ message: `O phone é Obrigatório` })
            return

        } else if (!password) {
            res.status(422).json({ message: `A senha é Obrigatório` })
            return

        } else if (!confirmpassword) {
            res.status(422).json({ message: `A cifirmação da senha é Obrigatório` })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: `A senha e a confirmação da senha não são iguas!` })
            return
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: "Usuário já cadastrado!" })
            return
        }
    }
}