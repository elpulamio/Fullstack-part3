import React from 'react'

const Person = ({ person, handleDelete }) => {
  return (
    <>{person.name} {person.number}
      <button onClick={() => handleDelete(person.id, person.name)} >
        delete
      </button>
      <br />
    </>
  )
}

export default Person