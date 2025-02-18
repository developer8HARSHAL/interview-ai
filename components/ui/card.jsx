// components/ui/card.jsx

export function Card({ children, className = '' }) {
    return <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`}>{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
  }
  
  export function CardDescription({ children }) {
    return <p className="text-gray-500 text-sm">{children}</p>;
  }
  
  export function CardFooter({ children }) {
    return <div className="mt-4">{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="text-lg font-semibold">{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h3 className="text-xl font-bold">{children}</h3>;
  }
  