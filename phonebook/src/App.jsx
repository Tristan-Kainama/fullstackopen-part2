import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456'},
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122'}
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const handleSearch = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase())))
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const targetJson = JSON.stringify(personObject);
    const hasEqualValue = persons.some(item => JSON.stringify(item) === targetJson);

    if (hasEqualValue){
      alert(`${personObject.name} is already added to phonebook`)
    } else {
      setSearch('')
      setPersons(persons.concat(personObject))
      setFilteredPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with <input value={search} onChange={handleSearch}/>
        </div>
      </form>

      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {filteredPersons.map((person, i) => <p key={i}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App