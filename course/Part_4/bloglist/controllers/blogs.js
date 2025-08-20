const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

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


module.exports = blogRouter