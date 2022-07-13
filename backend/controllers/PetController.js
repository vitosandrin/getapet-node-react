const Pet = require('../models/Pet')

//Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    //Create Pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const images = req.files
        const available = true
        //console.log(images)

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
        if (images.length === 0) {
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

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: '!Pet cadastrado com sucesso!',
                newPet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    //Get all the pets
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')
        //find() - get all pets .sort('-createdAt) - ordena do mais novo p mais velho

        res.status(200).json({
            pets: pets
        })
    }

    //Get all the pets I put for donation
    static async getAllUserPets(req, res) {

        //Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort("-createAt")

        res.status(200).json({ pets })
    }

    //Get all the pets I want to adopt
    static async getAllUserAdoptions(req, res) {
        //Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort("-createAt")

        res.status(200).json({ pets })
    }

    //Route to get info from pet
    static async getPetById(req, res) {

        const id = req.params.id

        //Verify if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: '!ID inválido!' })
            return
        }
        //Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: '!Pet não encontrado!' })
            return
        }

        res.status(200).json({ pet: pet })

    }

    //Route to delete pets
    static async removePetById(req, res) {
        const id = req.params.id

        //Verify if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: '!ID inválido!' })
            return
        }

        //Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: '!Pet não encontrado!' })
            return
        }

        //Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        //Compare user.id != pet.user.id
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: '!Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        //Delete pet
        await Pet.findByIdAndRemove(id)
        res.status(200).json({ message: '!Pet removido com sucesso!' })

    }

    //Uptade pet
    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, available } = req.body
        
        //Data pet update
        const updatedData = {}
        //Images upload
        const images = req.files

        //Verify if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: '!ID inválido!' })
            return
        }

        //Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: '!Pet não encontrado!' })
            return
        }

        //Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        //Compare user.id != pet.user.id
        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: '!Houve um problema em processar a sua solicitação, tente novamente mais tarde!' })
            return
        }

        //Validations
        if (!name) {
            res.status(422).json({ message: '!O nome é obrigatório!' })
            return
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({ message: '!A idade é obrigatório!' })
            return
        } else {
            updatedData.age = age
        }

        if (!weight) {
            res.status(422).json({ message: '!O peso é obrigatório!' })
            return
        } else {
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({ message: '!A cor é obrigatória!' })
            return
        } else {
            updatedData.color = color
        }

        if (images.length > 0) {
            updatedData.images = []
            //map.Array and add one img to the Array at a time
            images.map(image => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: '!Pet atualizado com sucesso!' })
    }

    //Schedule a visit
    static async schedule(req, res){

        const id = req.params.id

        //Check if pet exists
        const pet = await Pet.findOne({_id: id})
        if(!pet) {
            res.status(404).json({message: '!Pet não encontrado!'})
            return
        }

        //Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        //Compare user.id && pet.user.id
        if(pet.user._id.equals(user._id)) {
            res.status(422).json({message: '!Você não pode agendar uma visita com seu proprio Pet!'})
            return
        }

        //Check if the user has already scheduled a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({message: 'Você já agendou uma visita para esse Pet!'})
                return
            }
        }

        //Add user as pet adopter
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }
        await Pet.findByIdAndUpdate(pet._id, pet)
        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })
    }
}