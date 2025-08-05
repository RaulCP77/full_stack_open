const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.static('dist'))

let persons = [
  { 
    name: 'Arto Hellas', 
    number: '040-123456', 
    id: 1 }
]
app.get('/', (req, res) => {
  res.send('<h1>Hello World 2!</h1>');
});
app.get('/api/persons', (req, res) => {
  res.json(persons);
});
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body || !body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  };

  persons = persons.concat(note);
  res.json(note);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

