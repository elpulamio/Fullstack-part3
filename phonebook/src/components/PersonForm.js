import React from 'react'

const PersonForm = ({ filterOnSubmit, filterValue, filterValue2, filterOnChange, filterOnChange2 }) => {
    return (
      <form onSubmit={filterOnSubmit}>
        <div>
          name: <input value={filterValue} onChange={filterOnChange} /><br />
          number: <input value={filterValue2} onChange={filterOnChange2} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm