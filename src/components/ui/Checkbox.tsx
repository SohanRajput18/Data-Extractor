import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-2 text-sm">
          {label && (
            <label
              htmlFor={props.id}
              className="font-medium text-slate-700 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-slate-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;