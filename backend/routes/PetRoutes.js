const router = require('express').Router()

const PetController = require('../controllers/PetController')

//Middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')
 
router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    PetController.create
)

router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)

router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

router.delete('/:id', verifyToken, PetController.removePetById)

module.exports = router