require('dotenv').config()

const express = require('express');
const app = express();
const cors = require('cors');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(express.static('dist'))

const Person = require('./models/person')

app.get('/', (req, res) => {
  res.send('<h1>Hello World 2!</h1>');
});
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  }).catch(error => {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch persons' });
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: 'Person not found' });
    }
  }).catch(error => {
    console.error(error => next(error));
  });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(result => {
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).send({ error: 'Person not found' });
    }
  }).catch(error => {
    console.error(error => next(error));
  });
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' });
  }
  Person.find({ name: body.name }).then(existingPersons => {
    if (existingPersons.length > 0) {
      return res.status(400).json({ error: 'name must be unique' });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then(savedPerson => {
      res.json(savedPerson);
    }).catch(error => next(error));
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body;

  Person.findByIdAndUpdate(req.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.use(unknownEndpoint)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

