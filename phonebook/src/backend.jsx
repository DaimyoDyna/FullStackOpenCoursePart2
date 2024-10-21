import axios from 'axios'

const baseURL = 'http://localhost:3001/persons/'

//the persons and contacts are updated in useEffect automatically! The wonders of React!
//ID is handled automatically!
export const handlePost = (name, num) => {
  const newPerson = {"name": name, "number": num}
  axios.post(baseURL, newPerson)
}

export const handleDelete = (buttonName, buttonId) => {
  if (window.confirm('Delete ' + buttonName + ' ?')) {
    axios.delete(`${baseURL}${buttonId}`)
  }
}

export const handleReplace = async (name, num) => {
  const people = await axios.get(baseURL)
  const oldPerson = people.data.find(person => person.name.toLowerCase() === name.toLowerCase())
  await axios
    .put(`${baseURL}${oldPerson.id}`, {"name": name, "number": num})
    .catch(error => {
      handleNotify(`Information of ${name} has already been removed from server`, true)
    })
}