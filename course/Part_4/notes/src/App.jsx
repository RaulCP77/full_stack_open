import { useState } from 'react'
import axios from 'axios'
import Footer from './components/Footer'
import Note from './components/Note'
import Notification from './components/Notification'
import notesService from './services/notes'
import { useEffect } from 'react';

const App = ({ props }) => {
  const [notes, setNotes] = useState(props);
  const [newNote, setNewNote] = useState('add a new note');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some error happened...');

  useEffect(() => {
    notesService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []);

  console.log('render', notes.length, 'notes');
  
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        alert(`The note '${note.content}' was already removed from server`);
        setNotes(notes.filter((n) => n.id !== id));
      });
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: (notes.length + 1).toString()
    }
    notesService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      })
      .catch((error) => {
        setErrorMessage(
          `Note ${note.content} was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== note.id));
      });
  }
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);
    


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit" >Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
