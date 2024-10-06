/* eslint-disable react/prop-types */
// SelectDonationCategory.js

const donationCategories = [
  { value: 'clothes', label: 'Clothes' },
  { value: 'food', label: 'Food' },
  { value: 'money', label: 'Money' },
  { value: 'medicines', label: 'Medicines' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' },
];

const SelectDonationCategory = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 font-medium mb-2"
        htmlFor="donationCategory"
      >
        Donation Category:
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={onChange}
      >
        <option value="">Select Donation Category</option>
        {donationCategories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDonationCategory;