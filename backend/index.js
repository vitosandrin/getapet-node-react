//Config require
const express = require('express')
const cors = require('cors')

const app = express()

//Config JSON response
app.use(express.json())

//Solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Public folder for img
app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/UserRoutes')

app.use('/users', UserRoutes)

//PORT
app.listen(5000)

