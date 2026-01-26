import React from 'react';

function CategoryFilters({ categories, selectedCategories, onToggleCategory }) {
  return (
    <div className="mb-5">
      <label className="block text-xs text-muted mb-3 uppercase tracking-wide font-medium">
        Categories
      </label>

      <div className="flex flex-col gap-2">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <label
              key={category.id}
              className={`flex items-center p-2.5 rounded-md cursor-pointer transition-colors duration-200 ${
                isSelected
                  ? 'bg-primary/10'
                  : 'bg-transparent hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleCategory(category.id)}
                className="mr-3 cursor-pointer w-4 h-4"
              />

              <span className="text-xl mr-2">
                {category.icon}
              </span>

              <span className={`flex-1 text-[0.9rem] ${
                isSelected
                  ? 'text-primary font-medium'
                  : 'text-muted font-normal'
              }`}>
                {category.name}
              </span>

              <span className="text-sm text-muted font-semibold bg-white/10 py-0.5 px-2 rounded">
                {category.count || 0}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilters;
