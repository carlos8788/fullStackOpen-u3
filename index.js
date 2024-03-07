require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :response-time :body ms'))

let persons = [
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" }
];


app.get('/api/persons', (req, res) => {

    Person.find().then(persons => res.json(persons));

})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    Person.findOne({ id: id })
        .then(person => res.json(person))
        .catch(err => res.json({ error: err }));

})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const person = persons.find(person => person.id === Number(id));
    if (person) {
        persons = persons.filter(person => person.id !== Number(id));
        return res.json({ message: 'Person was deleted succesufully' })
    } else {
        return res.status(404).json({ message: 'Person not found' })
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    Person.findOne({ name: body.name })
        .then(person => {
            if (person) {
                return res.status(422).json({ error: 'name exists', person })
            }
            const newPerson = new Person({
                name: body.name,
                number: body.number,
            })
            newPerson.save().then(savedPerson => {
                res.json(savedPerson)
            })
        })
})



app.get('/info', (req, res) => {
    let info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date().toString()}</p>`
    res.send(info)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})