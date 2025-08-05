const Person = ({ filteredPersons, removePerson }) => {
  return (
        <>
        <ul>
            {filteredPersons.map((person, index) => (
            <li key={index}>{person.name}: {person.number}
                <button style={{marginLeft: "10px"}} onClick={() => removePerson(index)}>Delete</button>
            </li>
            ))}
        </ul>
        </>
  )
}

export default Person
