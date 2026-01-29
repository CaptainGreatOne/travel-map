import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ColorSchemeToggle from './ColorSchemeToggle';
import StatusFilters from './StatusFilters';
import CategoryFilters from './CategoryFilters';

/**
 * SidebarFilters component - collapsible filters section for map sidebar.
 *
 * @param {Object} props
 * @param {boolean} props.filtersOpen - Whether filters panel is expanded
 * @param {Function} props.setFiltersOpen - Toggle filters expansion
 * @param {string} props.mapStyle - Current map tile style
 * @param {Function} props.setMapStyle - Set map tile style
 * @param {string} props.colorScheme - 'status' or 'category'
 * @param {Function} props.setColorScheme - Set color scheme
 * @param {Array} props.selectedStatuses - Selected status filters
 * @param {Function} props.handleToggleStatus - Toggle status filter
 * @param {number} props.visitedCount - Count of visited locations
 * @param {number} props.wantToVisitCount - Count of want-to-visit locations
 * @param {Array} props.categoriesWithCounts - Categories with counts
 * @param {Array} props.selectedCategories - Selected category filters
 * @param {Function} props.handleToggleCategory - Toggle category filter
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Set search query
 * @param {string} props.countryFilter - Current country filter
 * @param {Function} props.setCountryFilter - Set country filter
 * @param {Array} props.uniqueCountries - Array of unique countries
 */
function SidebarFilters({
  filtersOpen,
  setFiltersOpen,
  mapStyle,
  setMapStyle,
  colorScheme,
  setColorScheme,
  selectedStatuses,
  handleToggleStatus,
  visitedCount,
  wantToVisitCount,
  categoriesWithCounts,
  selectedCategories,
  handleToggleCategory,
  searchQuery,
  setSearchQuery,
  countryFilter,
  setCountryFilter,
  uniqueCountries
}) {
  return (
    <div className="border-t border-white/10 pt-4 flex-1">
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="w-full bg-transparent border-none text-gray-100 flex items-center justify-between py-2 cursor-pointer text-[0.95rem] font-medium"
      >
        <span className="flex items-center gap-2">
          <Filter size={18} />
          Filters
        </span>
        {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {filtersOpen && (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full p-2.5 rounded-md border border-white/20 bg-secondary text-gray-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {uniqueCountries.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
                Country
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full p-2.5 rounded-md border border-white/20 bg-secondary text-gray-100 text-sm cursor-pointer"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-6 pb-6 border-b border-white/10">
            <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
              Map Style
            </label>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="w-full p-2.5 rounded-md border border-white/20 bg-secondary text-gray-100 text-sm cursor-pointer"
            >
              <option value="standard">Standard</option>
              <option value="terrain">Terrain</option>
              <option value="satellite">Satellite</option>
              <option value="watercolor">Watercolor</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <ColorSchemeToggle value={colorScheme} onChange={setColorScheme} />

          {colorScheme === 'status' && (
            <StatusFilters
              selectedStatuses={selectedStatuses}
              onToggleStatus={handleToggleStatus}
              visitedCount={visitedCount}
              wantToVisitCount={wantToVisitCount}
            />
          )}

          {colorScheme === 'category' && (
            <CategoryFilters
              categories={categoriesWithCounts}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default SidebarFilters;
