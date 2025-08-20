const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async(request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  try {
    if (!body.content) {
      return response.status(400).json({ error: 'content missing' })
    }
  } catch (exception) {
    next(exception)
  }
  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})
notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
    response.json(updatedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter