const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(bodyParser.json());
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));
app.use(cors());

let persons = [
    {
        name: 'Niko Salminen',
        number: '040-8311293',
        id: 1,
    },
    {
        name: 'Simo Kuossimo',
        number: '040-2847021',
        id: 2,
    },
    {
        name: 'Palokunta',
        number: '112',
        id: 3,
    },
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const person = persons.find(person => person.id === id);
    if (typeof person === 'undefined') {
        res.status(404);
        res.json({ error: 'Person not found' });
    } else {
        res.json(person);
    }
});

app.post('/api/persons', (req,res) => {
    const person = req.body;
    if (typeof person.name === 'undefined' || person.name.length === 0) {
        res.status(400);
        res.json({ error: 'Person name missing' });
        return;
    }
    if (typeof person.number === 'undefined' || person.number.length === 0) {
        res.status(400);
        res.json({ error: 'Person number missing' });
        return;
    }
    if (persons.some(p => p.name === person.name)) {
        res.status(400);
        res.json({ error: 'Name must be unique' });
        return;        
    }
    person.id = parseInt(Math.random() * 10000000);
    persons.push(person);
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (typeof person === 'undefined') {
        res.status(404);
        res.json({ error: 'Person not found' });
    } else {
        res.status(204);
        persons = persons.filter(person => person.id !== id);
        res.send();
    }
});

app.get('/info', (req, res) => {
    res.send(`Tietokannassa ${persons.length} nimeä`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
