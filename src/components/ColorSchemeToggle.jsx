import React from 'react';

function ColorSchemeToggle({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-xs text-muted mb-3 uppercase tracking-wide font-medium">
        Color Pins By
      </label>

      <div className="flex gap-3">
        <label
          className={`flex-1 flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ${
            value === 'status'
              ? 'bg-primary/15 border-2 border-primary'
              : 'bg-white/5 border-2 border-transparent hover:bg-white/[0.08]'
          }`}
        >
          <input
            type="radio"
            value="status"
            checked={value === 'status'}
            onChange={(e) => onChange(e.target.value)}
            className="mr-2 cursor-pointer"
          />
          <span className={`text-[0.9rem] ${
            value === 'status'
              ? 'text-primary font-semibold'
              : 'text-muted font-normal'
          }`}>
            Status
          </span>
        </label>

        <label
          className={`flex-1 flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 ${
            value === 'category'
              ? 'bg-primary/15 border-2 border-primary'
              : 'bg-white/5 border-2 border-transparent hover:bg-white/[0.08]'
          }`}
        >
          <input
            type="radio"
            value="category"
            checked={value === 'category'}
            onChange={(e) => onChange(e.target.value)}
            className="mr-2 cursor-pointer"
          />
          <span className={`text-[0.9rem] ${
            value === 'category'
              ? 'text-primary font-semibold'
              : 'text-muted font-normal'
          }`}>
            Category
          </span>
        </label>
      </div>
    </div>
  );
}

export default ColorSchemeToggle;
