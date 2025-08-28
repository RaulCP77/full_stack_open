import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('error')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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
        'loggedBlogppUser', JSON.stringify(user)
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
    window.localStorage ? window.localStorage.removeItem('loggedBlogppUser'): null
    setUser(null)  
  }

  const clearBLogForm = () => {
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const newErrorMessage = (message, type) => {
      setErrorMessage(message)
      setErrorType(type)

      setTimeout(() => {
        setErrorMessage(null)
        setErrorType('error')
      }, 10000)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const noteObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user
    }

    try {
      const returnedBlog = await blogService.create(noteObject)
      setBlogs(blogs.concat(returnedBlog))
      newErrorMessage(`New blog: ${returnedBlog.title}, created by: ${returnedBlog.author}`, 'success')
      clearBLogForm()
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
  const blogList = () => {
    return (
      <>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

const newBLog = () => {
  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor='Title'>Title: </label>
          <input type='text' name='Title' value={newTitle} onChange={({target}) => setNewTitle(target.value)}></input>
        </div>
        <div>
          <label htmlFor='Author'>Author: </label>
          <input type='text' name='Author' value={newAuthor} onChange={({target}) => setNewAuthor(target.value)}></input>
        </div>
        <div>
          <label htmlFor='Url'>Url: </label>
          <input type='url' name='Url' value={newUrl} onChange={({target}) => setNewUrl(target.value)}></input>
        </div>
        <button type='submit'>Create new blog</button>
      </form>
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
          {newBLog()}
          {blogList()}
        </div>
      }
    </>
  )
}

export default App