import React from 'react'
import { FaSearch } from 'react-icons/fa';

const FilterBar = ({ searchTerm, onChange }) => {
  return (
   <div id="donation-search-bar" className="relative w-80">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Filter by Type or Location"
        value={searchTerm}
        onChange={onChange}
        className="pl-10 pr-4 py-2 w-full rounded-md bg-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>
  )
}

export default FilterBar
