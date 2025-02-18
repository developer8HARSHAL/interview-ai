 
// components/ui/input.jsx

export function Input({ label, type = 'text', value, onChange, placeholder, className = '' }) {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>
    );
  }
  