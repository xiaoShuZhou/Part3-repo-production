const mongoose = require('mongoose')

const url =
    'mongodb+srv://sean:' + password + '@cluster0.ak7cudh.mongodb.net/?retryWrites=true&w=majority'

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    minLength: 5,
    required: true,
  },
})

const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })


  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}


module.exports = mongoose.model('Person', personSchema)