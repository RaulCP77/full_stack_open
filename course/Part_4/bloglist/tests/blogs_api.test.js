const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const { url } = require('node:inspector')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('bloglist api is working', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the number of blogs is correct', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length) // Assuming no blogs in the initial state
})

test('verify that the identifier field is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert(blog.id, 'Blog does not have an id field')
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'New Blog',
        after: 'New Author',
        url: 'http://newblog.com',
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert(titles.includes(newBlog.title), 'New blog was not added')
})


after(async () => {
    await mongoose.connection.close()
})