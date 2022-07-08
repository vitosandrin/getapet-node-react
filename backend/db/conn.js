const mongoose = require("mongoose")

async function main() {
    await mongoose.connect("mongodb://localhost:27017/getapet")
    console.log('!Conected to db!')
}

main().catch(err => console.log(err))

module.exports = mongoose