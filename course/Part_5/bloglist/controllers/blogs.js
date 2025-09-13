const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  const username = request.username;

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })


  try {
    if (!blog.title || !blog.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }
    if (blog.likes === undefined) {
      blog.likes = 0 // Default likes to 0 if not provided
    }
  } catch (exception) {
    next(exception)
  }
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)

})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)

  if(!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  console.log(`Blog with id ${request.params.id} deleted`)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {likes},
      { new: true  }
    ).populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter