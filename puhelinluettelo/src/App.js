import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const PersonForm = ({person, name, number, handlename, handlenumber}) =>
{
  return (
  <form  onSubmit={person}>
  <div>
    name: <input value={name}
    onChange={handlename} />
  </div>
  <div>
    number: <input value={number}
    onChange={handlenumber} />
  </div>
  <div>
    <button type="submit">add</button>
  </div>
</form >
  )
}
const NumbersShown = ({personmap, del}) =>
{

 
  return (
  <div> {personmap.map(person => 
    <p key={person.name}> {person.name} {person.number} <button onClick={() => del(person)}>delete</button></p>
  )}
  </div>
  )
  }

const Filter =({search, filter}) =>
{
  return (

    <div>
    filter shown with: <input value={search}
        onChange={filter} />
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [personsToShow, setPersonsToShow] = useState([])  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState("")
  const [noti, setNoti] = useState(null)
  const [erNoti, setErNoti] = useState(null)
  
    const ref = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
        setPersonsToShow(response.data)
      })
  }
  useEffect(ref, [])
  
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const filter = (event) => {
    
    const keyword = event.target.value;

    if (keyword !== "") {
      const results = persons.filter((person) => {
        return person.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setPersonsToShow(results);
    } else {
      setPersonsToShow(persons);
    }

    setNewSearch(keyword);
    setPersons(persons);
  };

  const addPerson = (event) => {
    event.preventDefault()
      const personObject = {
      name: newName,
      number: newNumber
      }
      const personOnList = persons.find(person => person.name === personObject.name)
      const changedNum = {...personOnList, number: personObject.number}
      if (persons.filter(person => 
        person.name === personObject.name).length !== 0
        )
      {
        if (window.confirm(`${newName} is already in phonebook, want to change number?`))
        {
          personService
          .update(changedNum.id, changedNum)
          .then(response => {
            setPersons(persons.map(person=> person.id !== changedNum.id ? person : response.data))
            setPersonsToShow(persons.map(person=> person.id !== changedNum.id ? person : response.data))
            setNoti(`${newName}'s number has been updated`)
            setTimeout(() => {
              setNoti(null)
            }, 5000)
          })
          .catch(error => {
            setErNoti(`${newName}'s info has already been removed from the server`)
            setTimeout(() => {
              setErNoti(null)
            }, 5000)
          })
        }
  
      } else {
        personService
        .create(personObject)
        .then(response => {
        setPersons(persons.concat(response.data))
        setPersonsToShow(persons.concat(response.data))
        setNewName("")
        setNewNumber("")
        setNoti(`${newName} added to phonebook`)
        setTimeout(() => {
          setNoti(null)
        }, 5000)
         
        })
      }
  console.log('person added', persons)
  setNewName("")
  setNewNumber("")
  setPersons(persons);
  
  }
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="notification">
        {message}
      </div>
    )
  }
  const Error = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  const del = (person) => {
  if (window.confirm(`delete ${person.name} ?`))
    {
    personService
    .deletor(person.id)
    setPersons(persons.filter(p => p.id!==person.id));
    }
    console.log('person deleted', persons)
    setNewName("")
    setNewNumber("")
    setPersonsToShow(persons.filter(p => p.id!==person.id));
    setNoti(`${person.name} removed from phonebook`)
    setTimeout(() => {
      setNoti(null)
    }, 5000)
    }
  return (
    <div>
    <h2>Phonebook</h2>
    <Notification message={noti} />
    <Error message={erNoti} />
    <Filter filter={filter} search={newSearch} />
    <h2>add a new contact info</h2>
    <div>
    <PersonForm person={addPerson} name={newName} number={newNumber} handlename={handleNameChange} handlenumber={handleNumberChange} />
    </div>
    <h2>Numbers</h2>
    <NumbersShown personmap={personsToShow} del={del} />
    </div>
  
   
  )

}


export default App
