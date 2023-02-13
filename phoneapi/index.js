const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Person= require('./models/person')

app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}  )

app.get('/info', (request, response) => {
  const currentDate = new Date().toString()
  Person.find({}).then(persons => {
    response.send(
      `<div>
            <p>Phonebook has info for ${persons.length} people</p>
          </div>
          <div>
            <p>${currentDate}</p>
          </div>`
    )
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)
  Person.findById(id).then(person => {
    if (!person) {
      return response.status(404).end()
    }
    response.json(person)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = String(request.params.id)
  Person.findByIdAndRemove(id).then(result => {
    response.status(204).end()
  }
  ).catch(error => next(error))
})

//Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.
//Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const personName = body.name
  const personNumber = body.number

  const person = new Person({
    name: personName,
    number: personNumber
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

//update existing phonebook number according to the name
app.put('/api/persons/:id', (request, response,next) => {
  const body = request.body
  const id = String(request.params.id)

  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})