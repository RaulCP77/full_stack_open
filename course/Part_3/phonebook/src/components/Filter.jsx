const Filter = ({ filter, handleFilterChange }) => {
  return (
        <>
        <h3>Filter</h3>
        <div>
          filter shown with <input value={filter} onChange={handleFilterChange} />
        </div>
        </>
  )
}

export default Filter
