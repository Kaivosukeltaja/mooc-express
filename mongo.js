require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

if (process.argv.length > 2) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} else {
  console.log('Puhelinluettelo:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
