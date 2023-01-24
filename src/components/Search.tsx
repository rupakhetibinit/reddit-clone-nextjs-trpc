import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Search = () => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-6 w-6 text-sm text-gray-400" />
      </div>
      <input
        type="search"
        className="block w-full rounded-full border-2 p-2 pl-10 text-sm text-gray-400"
        placeholder="Search Reddit"
      />
    </div>
  );
};
export default Search;
