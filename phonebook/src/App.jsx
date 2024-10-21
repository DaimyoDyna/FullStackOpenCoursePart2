import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

//the three separated components are imported here:
import { PhonebookForm } from './form'
import { updateSearch } from './updatesearch'
import { updatePersons } from './updatepersons'
import { handlePost, handleDelete, handleReplace } from './backend'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [contacts, setContacts] = useState([])
  //const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null) //an empty string would still show the notification box, hence null

  useEffect(() => {
    //initialises the numbers
    const fetchAllData = async () => {  
      const allData = await axios.get('http://localhost:3001/persons')
      setPersons(allData.data)
      setContacts(allData.data)
    }
    fetchAllData()
  }, [persons]) //always updated when persons is updated

  const handleNameState = (event) => {
    //handles the changes in the name field
    setNewName(event.target.value)
    //(console.log if necessary here)
  }

  const handleNumberState = (event) => {
    //handles the changes in the number field
    setNewNumber(event.target.value)
    //(console.log if necessary here)
  }

  const handleSearch = (event) => {
    //handles the changes in the search field
    const currentSearch = event.target.value //used in setContacts because of how React state works
    //console.log(search)
    updateSearch({ setContacts, persons, currentSearch })
  }

  const handleSubmission = (event) => {
    //prevents refreshing the page etc.
    event.preventDefault()
    //send to array (or server) here, unless the name is a duplicate
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        handleReplace(newName, newNumber)
        //quick notification here:
        handleNotify(`Updated ${newName}'s number to ${newNumber}`)
      }
    } else {
      //we update the server, and the rest is updated by useEffect automatically:
      handlePost(newName, newNumber)
      //quick notification here:
      handleNotify(`Added ${newName}`)
    }
  }

  const Notification = ({ message, error }) => { //renders notifications
    if (message === null) {
      return null
    }
    if (!error) {
      return (
        <div className='notification'>
          {message}
        </div>
      )
    } else { //error notifications need to look different (css)
      return(
        <div className='error'>
          {message}
        </div>
      )
    }
  }

  const handleNotify = (message, error) => {
    if (!error) {
      setNotification(message)
      setTimeout(() => {
        setNotification(null) //null -> notification disappears
      }, 2500) //2.5 sec notification
    } else {
      setNotification(message, true) //for errors, error === true
      setTimeout(() => {
        setNotification(null)
      }, 2500)
    }
  }

  return ( //actually rendered onto the screen:
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <div>
        filter shown with <input onChange={handleSearch} />
      </div>
      <h2>Add new person</h2>
      <PhonebookForm 
        handleSubmission={handleSubmission}
        handleNameState={handleNameState}
        handleNumberState={handleNumberState}
      />
      <h2>Numbers</h2>
      <ul>
        {contacts.map(person => (
          <li key={person.name}>
            {person.name} {person.number} 
            <button type="button" onClick={() => handleDelete(person.name, person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
