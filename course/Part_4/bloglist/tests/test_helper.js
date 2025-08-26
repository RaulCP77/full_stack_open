const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    "title": "First test blog",
    "author": "First Author",
    "url": "http://example.com/first",
    "likes": 4
  },
  {
    "title": "Second test blog",
    "author": "Second Author",
    "url": "http://example.com/second",
    "likes": 7
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Temporary Author', url: 'http://example.com/temp', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}