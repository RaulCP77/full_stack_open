require('dotenv').config()
const express = require('express');
const Note = require('./models/note')

const app = express();

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next();
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json()); 
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  }).catch(error => {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch notes' });
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note);
    } else {
      response.status(404).end({ error: 'Note not found' });
    }
  }).catch(error => {
    console.error(error => next(error));
  })
})


app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id).then(result => {
      res.status(204).end();
  }).catch(error => {
    console.error(error => next(error));
  })
});



app.post('/api/notes', (req, res, next) => {
  const body = req.body;

  if (!body || !body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save().then(savedNote => {
    res.json(savedNote);
  }).catch(error => next(error));
});

app.put('/api/notes/:id', (req, res, next) => {
  const {content, important} = req.body;

  Note.findByIdAndUpdate(req.params.id, {content, important}, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      console.log('note updated:', updatedNote);
      res.json(updatedNote);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})