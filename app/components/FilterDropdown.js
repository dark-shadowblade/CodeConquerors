'use client';

export default function FilterDropdown({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select...",
  disabled = false,
  hint = null
}) {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <div className="custom-select">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="filter-select"
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">▼</span>
      </div>
      {hint && <div className="filter-hint">{hint}</div>}
    </div>
  );
}
