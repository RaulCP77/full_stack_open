const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addNewName, cleanFocus }) => {
  return (
        <>
        <div>
          name: <input value={newName} onChange={handleNameChange} onFocus={cleanFocus} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} onFocus={cleanFocus} />
        </div>
        <div>
          <button type="submit" onClick={addNewName}>add</button>
        </div>
        </>
  )
}

export default PersonForm
