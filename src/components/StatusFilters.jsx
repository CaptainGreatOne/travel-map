import React from 'react';

function StatusFilters({ selectedStatuses, onToggleStatus, visitedCount, wantToVisitCount }) {
  const statuses = [
    {
      id: 'visited',
      label: 'Visited',
      icon: '✓',
      count: visitedCount,
      color: '#6ecf8e'
    },
    {
      id: 'want-to-visit',
      label: 'Want to Visit',
      icon: '⭐',
      count: wantToVisitCount,
      color: '#5fa8d3'
    }
  ];

  return (
    <div className="mb-5">
      <label className="block text-xs text-muted mb-3 uppercase tracking-wide font-medium">
        Status
      </label>

      <div className="flex flex-col gap-2">
        {statuses.map(status => {
          const isSelected = selectedStatuses.includes(status.id);

          return (
            <label
              key={status.id}
              className={`flex items-center p-2.5 rounded-md cursor-pointer transition-colors duration-200 ${
                isSelected
                  ? 'bg-primary/10'
                  : 'bg-transparent hover:bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleStatus(status.id)}
                className="mr-3 cursor-pointer w-4 h-4"
              />

              <span className="text-xl mr-2">
                {status.icon}
              </span>

              <span className={`flex-1 text-[0.9rem] ${
                isSelected
                  ? 'text-primary font-medium'
                  : 'text-muted font-normal'
              }`}>
                {status.label}
              </span>

              <span className="text-sm text-muted font-semibold bg-white/10 py-0.5 px-2 rounded">
                {status.count}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default StatusFilters;
