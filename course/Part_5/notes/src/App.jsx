import { useState } from 'react'
import { useEffect } from 'react'
import Footer from './components/Footer'
import Note from './components/Note'
import Notification from './components/Notification'
import notesService from './services/notes'
import loginService from './services/login'


const App = ({ props }) => {
  const [notes, setNotes] = useState(props)
  const [newNote, setNewNote] = useState('add a new note')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    notesService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      notesService.setToken(user.token)
    }
  }, [])

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    notesService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
}  

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      notesService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    notesService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
}

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true)
    
  const loginForm = () => (
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="Username">username</label>
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="Password">password</label>
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const noteForm = () => (
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit" >Save</button>
      </form>    
  )
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  )
}

export default App
