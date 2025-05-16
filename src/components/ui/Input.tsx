import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  className = '',
  error,
  ...props
}) => {
  const inputClasses = `
    block w-full px-3 py-2 border border-slate-300 rounded-md 
    shadow-sm text-slate-900 placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `;
  
  return (
    <div>
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;