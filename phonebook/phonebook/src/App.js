import axios from 'axios'
import React, { useState, useEffect } from 'react'
import AddPersonForm from './components/AddPersonForm'
import Filter from './components/Filter'
import FilteredPersons from './components/FilteredPersons'
import Notification from './components/Notification'

// import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  // get all data from http://localhost:3004/persons by using axios
  useEffect(() => {
    axios.get ('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  //add new person to http://localhost:3004/persons by using axios

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    //check if the person's information is already in the phonebook
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      const person = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
      updateNumber(person.id)
      return
    }
    axios.post('http://localhost:3001/api/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        //show notification for 3 seconds
        setNotification({
          text: `${newPerson.name}'s number is added.`,
          type: 'success'
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
      )
  }

  //delete person from http://localhost:3004/persons by using axios, 
  //and confirm the action from the user by using the window.confirm method
  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      axios.delete(`http://localhost:3001/api/persons/${id}`)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  //use the HTTP PUT method for updating the phone number,
  //if a number is added to an already existing user, the new number will replace the old number
  //If the person's information is already in the phonebook, the application can confirm the action from the user
  const updateNumber = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { name: newName, number: newNumber }
      axios.put(`http://localhost:3001/api/persons/${id}`, changedPerson)
        .then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response.data))
          setNewName('')
          setNewNumber('')

          //show notification for 3 seconds
          setNotification({
            text: `${changedPerson.name}'s number is updated.`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          setNewName('')
          setNewNumber('')
          //show notification for 3 seconds
          setNotification({
            text: `${changedPerson.name}'s information has already been removed from server.`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        }) 
    }
  }

  //controlled name state
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  //controlled number state
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  //controlled filter component
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <AddPersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <FilteredPersons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App