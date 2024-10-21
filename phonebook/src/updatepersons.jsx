export const updatePersons = ({ setPersons, persons, newName, newNumber }) => {
  setPersons([...persons, { name: newName, number: newNumber }])
  return null
}