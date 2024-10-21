export const updateSearch = ({ setContacts, persons, currentSearch }) => {
  setContacts(persons.filter(person => person.name.toLowerCase().includes(currentSearch.toLowerCase())))
  return null //as a separate component/function this could now be called easily in multiple spots
}