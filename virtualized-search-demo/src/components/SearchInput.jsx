import React from 'react';

const SearchInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="🔍 Пошук користувача..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        marginBottom: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}
    />
  );
};

export default SearchInput;
