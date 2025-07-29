import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import phonebookServices from './services/phonebook'
import axios from 'axios'
import { useEffect } from 'react'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 }
  ])
  const [newName, setNewName] = useState('Add new name')
  const [newNumber, setNewNumber] = useState('Add new number')
  const [filter, setFilter] = useState('')
  const [successMessage, setMessage] = useState(null);
  const [messaageType, setMessageType] = useState(0); // 0 for success, 1 for error

  useEffect(() => {
    phonebookServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }
  const filteredPersons = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;
  
    const handleNameChange = (event) => {
    setNewName(event.target.value);
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }
  const addNewName = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString()
    }
    if (checkIfPersonExists(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
        phonebookServices
          .update(personToUpdate.id, { ...personObject, id: personToUpdate.id })
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson));
            showMessage({
              message: `Updated ${newName}'s number`,
              messageType: 0
            });
            setNewName('');
            setNewNumber(''); 
          })
          .catch(error => {
            showMessage({
              message: `Error updating person ${newName}`,
              messageType: 1
            });
          });      }
      return;
    } else {
    phonebookServices
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        showMessage({
          message: `Added ${newName} to phonebook`,
          messageType: 0
        });  
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        showMessage({
          message: `Error adding ${newName} to phonebook`,
          messageType: 1
        });
      });
    }
  }
  const removeThisPerson = (index) => {
    if(window.confirm(`Delete ${filteredPersons[index].name}?`)) {
      const personToRemove = filteredPersons[index];
      phonebookServices
        .remove(personToRemove.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToRemove.id));
        })
        .catch(error => {
          showMessage({
            message: `Information of ${personToRemove.name} has already been removed from server`,
            messageType: 1
          });
        });
      }
  }
  const checkIfPersonExists = (name) => {
    return persons.some(person => person.name.toLowerCase() === name.toLowerCase());
  } 
  const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
    return (
      <div className={type === 0 ? "success" : "error"}>
        {message}
      </div>
    )
  }
  const showMessage = ({ message, messageType }) => {
    setMessage(message);
    setMessageType(messageType);
    setTimeout(() => {
      setMessage(null);
      setMessageType(0);
    }, 5000);
  }
  const cleanFocus = (event) => {
    event.target.value === 'Add new name' ? setNewName('') : null; // Clear input focus when clicked
    event.target.value === 'Add new number' ? setNewNumber('') : null; // Clear input focus when clicked
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type={messaageType} />
      <form>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />

        <h3>Add a new</h3>
        <PersonForm 
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          addNewName={addNewName}
          cleanFocus={cleanFocus}
        />
      </form>
      <h2>Numbers</h2>
      <Person filteredPersons={filteredPersons} removePerson={removeThisPerson} />   
    </div>
  )
}

export default App