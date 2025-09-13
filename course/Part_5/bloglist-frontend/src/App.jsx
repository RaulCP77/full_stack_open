import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()
  const [error, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('error')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])  

  const handleLogin = async (event) => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      newErrorMessage('Wrong username or password', 'error')
    }
  }

  const closeSession = () => {
    window.localStorage ? window.localStorage.removeItem('loggedBlogAppUser'): null
    setUser(null)  
  }

  

  const newErrorMessage = (message, type) => {
      setErrorMessage(message)
      setErrorType(type)

      setTimeout(() => {
        setErrorMessage(null)
        setErrorType('error')
      }, 10000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
        const returnedBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(returnedBlog))

        newErrorMessage(`New blog: ${returnedBlog.title}, created by: ${returnedBlog.author}`, 'success')
    } catch {
        newErrorMessage(`Error creating the new note`, 'error')
    }

  }
  const loginForm = () => {
    return (
      <>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor='Username'>Username</label>
          <input name='Username' type='text' value={username} onChange={({ target }) => setUsername(target.value)} ></input>
          <label htmlFor='Password'>Password</label>
          <input name='Password' type="password" value={password} onChange={({ target }) => setPassword(target.value)} ></input>
          <button type='submit'>Login</button>
        </form>
      </>
    )
  }
const addLikeBtn = async (blogObject) => {
  const blogId = blogObject.id
  try {
    const updatedBlog = await blogService.addLike(blogId, {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1
    })
    setBlogs(blogs.map(blog => (blog.id !== blogId ? blog : updatedBlog)))
  } catch {
    newErrorMessage(`Error updating the blog`, 'error')
  }
}
const deleteBlog = async (blogId) => {
  try {
    await blogService.deleteBlog(blogId)
    setBlogs(prev => prev.filter(blog => blog.id !== blogId))
  } catch {
    newErrorMessage(`Error deleting the blog`, 'error')
  }
}
  const blogList = () => {
    return (
      <>
        <h2>blogs</h2>
        {blogs
        .slice()
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} addBlogLike={addLikeBtn} deleteBlog={deleteBlog}  />
        )}
      </>
    )
  }

const notificationArea = () => {

  return (
    <>
      {error === null ? (
        <></>
      ) : (
        <div className={`notification ${errorType}`}>
          <p>{error}</p>
        </div>
      )}
    </>
  )
} 
  return (
    <>
      {notificationArea()}
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in <button type='button' onClick={() => closeSession()}>Login out</button></p>
          <Togglable buttonLabel='Create blog' buttonLabelClicked='Cancel' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} user={user} />
          </Togglable>
          {blogList()}
        </div>
      }
    </>
  )
}

export default App