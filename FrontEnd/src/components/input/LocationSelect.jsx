/* eslint-disable react/prop-types */
// LocationSelect.js

const locations = [
  "Jenin",
  "Nablus",
  "Tulkarem",
  "Tubas",
  "Qalqelia",
  "Jehrico",
  "Rammallah",
  "Jerusalem",
  "Hebron",
  "Bethlahim",
];

const LocationSelect = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 font-medium mb-2"
        htmlFor="location"
      >
        Location:
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={onChange}
      >
        <option value="">Select Location</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelect;