import React from 'react';
import type { FormInputProps } from '../types';

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-input">
      <label className="form-input-label">
        {label}
        {required && <span className="form-input-required">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className="form-input-field"
      />
    </div>
  );
};

export default FormInput;
