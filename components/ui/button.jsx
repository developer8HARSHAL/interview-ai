 
// components/ui/button.jsx

export function Button({ variant, children, onClick, className = '' }) {
    const baseStyles = 'px-4 py-2 rounded-md focus:outline-none';
  
    const variantStyles = {
      outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white',
      filled: 'bg-indigo-600 text-white hover:bg-indigo-700',
    };
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }
  