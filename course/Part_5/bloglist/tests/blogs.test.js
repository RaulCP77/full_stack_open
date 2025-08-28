const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('author with most blogs', () => {
    test('of empty list is null', () => {
        const blogs = []

        const result = listHelper.mostBlogs(blogs)
        assert.strictEqual(result, null)
    })

    test('when list has only one blog equals that blog', () => {
        const blogs = [
            {
                title: 'Single Blog',
                author: 'Single Author',
                url: 'http://example.com/single',
                likes: 10
            }
        ]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            title: 'Most Blogged Author',
            author: 'Single Author',
            blogs: 1
        })
    })
    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: 'Blog One',
                author: 'Author One',
                url: 'http://example.com/one',
                likes: 5
            },
            {
                title: 'Blog Two',
                author: 'Author Two',
                url: 'http://example.com/two',
                likes: 7
            },
            {
                title: 'Blog Three',
                author: 'Author Three',
                url: 'http://example.com/three',
                likes: 2
            },
            {
                title: 'Blog Four',
                author: 'Author One',
                url: 'http://example.com/four',
                likes: 3
            },
            {
                title: 'Blog Five',
                author: 'Author Two',
                url: 'http://example.com/five',
                likes: 4
            },
            {
                title: 'Blog Six',
                author: 'Author One',
                url: 'http://example.com/six',
                likes: 6
            }
        ]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            title: 'Most Blogged Author',
            author: 'Author One',
            blogs: 3
        })
    })
    test('when multiple authors have the same number of blogs, returns the first one', () => {
        const blogs = [
            {
                title: 'Blog One',
                author: 'Author One',
                url: 'http://example.com/one',
                likes: 5
            },
            {
                title: 'Blog Two',
                author: 'Author Two',
                url: 'http://example.com/two',
                likes: 7
            },
            {
                title: 'Blog Three',
                author: 'Author One',
                url: 'http://example.com/three',
                likes: 2
            },
            {
                title: 'Blog Four',
                author: 'Author Two',
                url: 'http://example.com/four',
                likes: 3
            }
        ]
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            title: 'Most Blogged Author',
            author: 'Author One',
            blogs: 2
        })
    })
})
describe('author with most likes', () => {
    test('of empty list is null', () => {
        const blogs = []

        const result = listHelper.mostLikes(blogs)
        assert.strictEqual(result, null)
    })

    test('when list has only one blog equals that blog', () => {
        const blogs = [
            {
                title: 'Single Blog',
                author: 'Single Author',
                url: 'http://example.com/single',
                likes: 4
            }
        ]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            title: 'Favourite Author',
            author: 'Single Author',
            likes: 4
        })
    })
    test('of a bigger list is calculated right', () => {
        const blogs = [
            {
                title: 'Blog One',
                author: 'Author One',
                url: 'http://example.com/one',
                likes: 5
            },
            {
                title: 'Blog Two',  
                author: 'Author Two',
                url: 'http://example.com/two',
                likes: 10
            },
            {
                title: 'Blog Three',
                author: 'Author Three',
                url: 'http://example.com/three',
                likes: 7
            },
            {
                title: 'Blog Four',
                author: 'Author One',
                url: 'http://example.com/four',
                likes: 3
            },
            {
                title: 'Blog Five',
                author: 'Author Two',
                url: 'http://example.com/five',
                likes: 4
            },
            {
                title: 'Blog Six',
                author: 'Author Three',
                url: 'http://example.com/six',
                likes: 6
            }
        ]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            title: 'Favourite Author',
            author: 'Author Two',
            likes: 14
        })
    })
    test('when multiple authors have the same number of likes, returns the first one', () => {
        const blogs = [
            {
                title: 'Blog One',
                author: 'Author One',
                url: 'http://example.com/one',
                likes: 5
            },
            {
                title: 'Blog Two',
                author: 'Author Two',
                url: 'http://example.com/two',
                likes: 5
            },
            {
                title: 'Blog Three',
                author: 'Author Three',
                url: 'http://example.com/three',
                likes: 3
            },
            {
                title: 'Blog Four',
                author: 'Author Four',
                url: 'http://example.com/four',
                likes: 5
            }
        ]
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            title: 'Favourite Author',
            author: 'Author One',
            likes: 5
        })
    })
})