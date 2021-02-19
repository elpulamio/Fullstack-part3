import React, { useState, useEffect } from 'react'
import Person from './Person'
import Filter from './Filter'
import PersonForm from './PersonForm'
import phonebookService from '../services/persons'
import Notification from './Notification'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ showAll ] = useState(false)
  const [ nameFilter, setNewFilter ] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [okMessage, setOkMessage] = useState(null)

  const hook = () => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])

  const namesToShow = showAll
    ? persons
    : persons.filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()))
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
  
    if (persons.map(item => item.name).includes(newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const filteredId = persons.filter(item => item.name == newName).map(filtered => filtered.id)
        phonebookService
          .update(filteredId, personObject)
          .then(() => {
            phonebookService
              .getAll()
              .then(initialPersons => {
                setPersons(initialPersons)
              })
              setOkMessage(
                `Person '${newName}' new number updated`
              )
              setTimeout(() => {
                setOkMessage(null)
              }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Person '${newName}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            phonebookService //render updated phonebook after error
              .getAll()
              .then(initialPersons => {
                setPersons(initialPersons)
              })
          })
      }
    }
    else{
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setOkMessage(
            `Added '${newName}'`
          )
          setTimeout(() => {
            setOkMessage(null)
          }, 5000)
        })
        /* FIXME: it is possible to create multible items with the same name 
        using different browsers at the same time and it cause problems
        if trying to update number for that name. Deleting is still possible
        because id is unique. So, it would need some check before add... */
    }
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
        .delPerson(id)
        .then(() => {
          setPersons(persons.filter(item => item.id !== id))
          setOkMessage(
            `'${name}' removed from server`
          )
          setTimeout(() => {
            setOkMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Person '${name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          phonebookService //render updated phonebook after error
            .getAll()
            .then(initialPersons => {
              setPersons(initialPersons)
            })
        })
    }
  }

  const handlePersonChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handlePersonChangeNr = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonChangeFilter = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification messageErr={errorMessage} messageOk={okMessage} />
      <Filter filterValue={nameFilter} filterOnChange={handlePersonChangeFilter} />
      <h2>add a new</h2>
      <PersonForm filterOnSubmit={addPerson} filterValue={newName} filterOnChange={handlePersonChangeName} filterValue2={newNumber} filterOnChange2={handlePersonChangeNr} />
      <h2>Numbers</h2>
      <div>
        {namesToShow.map(person => 
          <Person key={person.id} person={person} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}

export default App