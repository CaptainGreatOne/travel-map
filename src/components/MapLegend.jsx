import React from 'react';

function MapLegend({ colorScheme, categories, visitedCount, wantToVisitCount }) {
  if (colorScheme === 'status') {
    return (
      <div className="absolute bottom-[30px] left-[30px] bg-white p-4 px-5 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] z-[1000]">
        <h4 className="m-0 mb-3 text-sm text-secondary font-semibold uppercase tracking-wide">
          Status
        </h4>
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-visited rounded-full"></div>
          <span className="text-[0.9rem] text-secondary">Visited ({visitedCount})</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-want-to-visit rounded-full"></div>
          <span className="text-[0.9rem] text-secondary">Want to Visit ({wantToVisitCount})</span>
        </div>
      </div>
    );
  }

  // Category-based coloring
  return (
    <div className="absolute bottom-[30px] left-[30px] bg-white p-4 px-5 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] z-[1000] max-h-[300px] overflow-y-auto">
      <h4 className="m-0 mb-3 text-sm text-secondary font-semibold uppercase tracking-wide">
        Categories
      </h4>
      {categories.map(category => (
        <div
          key={category.id}
          className="mb-2.5 flex items-center gap-2.5"
        >
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: category.colorHex }}
          ></div>
          <span className="text-sm mr-1">
            {category.icon}
          </span>
          <span className="text-[0.9rem] text-secondary">
            {category.name} ({category.count || 0})
          </span>
        </div>
      ))}
    </div>
  );
}

export default MapLegend;
