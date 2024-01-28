const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const person = persons.find(person => person.id === Number(id));
    (person) ? res.json(person) : res.status(404).json({ message: 'No such person' })
})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const person = persons.find(person => person.id === Number(id));
    if (person) {
        persons = persons.filter(person => person.id !== Number(id));
        return res.json({message: 'Person was deleted succesufully'})
    }else{
        return res.status(404).json({message: 'Person not found'})
    }
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