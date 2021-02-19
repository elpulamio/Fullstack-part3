import React from 'react'

const Filter = ({ filterValue, filterOnChange }) => {
    return (
      <>filter shown with: <input value={filterValue} onChange={filterOnChange} /><br /></>
    )
}

export default Filter