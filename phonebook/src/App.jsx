import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = (props) => {
  return (
    <>
      <form>
        <div>
          filter shown with <input value={props.search} onChange={props.handleSearch}/>
        </div>
      </form>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
    </>
  )
}

const Persons = (props) => {
  return (
    <>
      {props.filteredPersons.map((person, i) => <p key={i}>{person.name} {person.number}</p>)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([]) 

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
      setFilteredPersons(response.data)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

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
      axios
      .post('http://localhost:3001/persons', personObject)
      .then(respons => {
        setPersons(persons.concat(personObject))
        setFilteredPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch}/>

      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App