const Pet = require('../models/Pet')

//Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class PetController {

    //Create Pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const images = req.files 
        const available = true
        console.log(images)
        
        //Validation
        if (!name) {
            res.status(422).json({ message: '!O nome é obrigatório!' })
            return
        }
        if (!age) {
            res.status(422).json({ message: '!A idade é obrigatória!' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: '!O peso é obrigatório!' })
            return
        }
        if (!color) {
            res.status(422).json({ message: '!A cor é obrigatória!' })
            return
        }
        if (!images.length == 0) {
            res.status(422).json({ message: '!A imagem é obrigatória!' })
            return
        }
        
        //Get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //Create a Pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image)=>{
            pet.images.push(image.filename)
        })

        try{
            const newPet = await pet.save()
            res.status(201).json({
                message:'!Pet cadastrado com sucesso!',
                newPet
            })
        }catch(error){
            res.status(500).json({message: error})
        }
    }
}