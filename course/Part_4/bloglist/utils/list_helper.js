const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  
  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})
    const mostLikedAuthor = Object.keys(likesByAuthor).reduce((a, b) =>
        likesByAuthor[b] > likesByAuthor[a] ? b : a
    )
    return {
        title: 'Most Liked Author',
        author: mostLikedAuthor,
        likes: likesByAuthor[mostLikedAuthor]   
    }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
    
    const blogsByAuthor = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})
    
    const mostBloggedAuthor = Object.keys(blogsByAuthor).reduce((a, b) =>
        blogsByAuthor[b] > blogsByAuthor[a] ? b : a
    )
    
    return {
        title: 'Most Blogged Author',
        author: mostBloggedAuthor,
        blogs: blogsByAuthor[mostBloggedAuthor]
    }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
    
    const likesByAuthor = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})
    
    const mostLikedAuthor = Object.keys(likesByAuthor).reduce((a, b) =>
        likesByAuthor[b] > likesByAuthor[a] ? b : a
    )
    
    return {
        title: 'Favourite Author',
        author: mostLikedAuthor,
        likes: likesByAuthor[mostLikedAuthor]
    }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}