const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))
morgan.token('custom', function (req, res) { return JSON.stringify(res.body) })

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
       id: 4,
       name: "Mary Poppendick",
       number: "39-23-6423122"
    }
]

//Title
app.get('/', (request, response) => {
  response.send('<h1>Persons</h1>')
})

//Info
const personAmount = persons.length
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${personAmount} people
    <br /><br />${new Date()}</p>
    `)
})

//GET all
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//GET id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//POST
app.use(morgan('custom'))
app.post('/api/persons', (request, response) => {
  const body = request.body
  const generateId = Math.floor(Math.random() * 999)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if (persons.find(item => item.name === body.name)){
    return response.status(409).json({ 
      error: 'name must be unique' 
    })
  }

  person = {
    id: generateId,
    name: body.name,
    number: body.number
  }
    
  persons = persons.concat(person)
  response.json(person)
})

//PORT
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
