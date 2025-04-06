import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div
      id="search-bar"
      className="flex justify-between items-center gap-1 bg-[#f5f0f0] shadow-inner px-3 py-2 rounded-3xl md:w-full lg:w-full relative border border-gray-300 focus-within:border-[#BD815A] focus-within:shadow-md transition-all duration-200">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 text-gray-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
      <input
        type="text"
        placeholder="Find your sneakers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        required
        className="text-[#262424] pl-2 md:hover:cursor-text w-full bg-transparent border-none outline-none text-sm"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="bg-[#e0d6d0] hover:bg-[#d2beb2] rounded-full flex justify-center items-center px-2 py-0.5 text-[#925835] text-xs font-medium transition-colors duration-200">
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;
