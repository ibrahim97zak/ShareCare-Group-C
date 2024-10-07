// eslint-disable-next-line react/prop-types
const InputField = ({ type, placeholder, value, onChange }) => {
  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none" 
        value={value} 
        onChange={onChange} 
        
      />
    </div>
  );
};

export default InputField;
  