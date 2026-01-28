import React, { useState, useRef, useEffect } from 'react';

/**
 * SearchableLocationSelect - Searchable dropdown for selecting locations
 *
 * Features:
 * - Text search filter (case-insensitive)
 * - "Visited only" checkbox filter
 * - Multi-select support
 * - Excluded items (grayed out)
 * - Keyboard navigation
 */
function SearchableLocationSelect({
  locations,
  selectedIds = [],
  onSelect,
  excludeIds = [],
  placeholder = 'Search locations...',
  multiSelect = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visitedOnly, setVisitedOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Filter locations based on search and visited filter
  const filteredLocations = locations.filter(loc => {
    // Search filter (case-insensitive)
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Visited filter
    const matchesVisited = !visitedOnly || loc.has_visited === true;

    return matchesSearch && matchesVisited;
  });

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredLocations.length, searchTerm, visitedOnly]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  function handleInputFocus() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  }

  function handleInputBlur() {
    // Delay close to allow click on dropdown items
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const selectableLocations = filteredLocations.filter(loc => !excludeIds.includes(loc.id));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          Math.min(prev + 1, filteredLocations.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        const highlightedLocation = filteredLocations[highlightedIndex];
        if (highlightedLocation && !excludeIds.includes(highlightedLocation.id)) {
          handleSelect(highlightedLocation);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  function handleSelect(location) {
    if (excludeIds.includes(location.id)) return;

    onSelect(location);

    if (!multiSelect) {
      setIsOpen(false);
      setSearchTerm('');
    }
  }

  function handleClear() {
    setSearchTerm('');
    inputRef.current?.focus();
  }

  // Get category icon/emoji
  function getCategoryIcon(category) {
    if (!category) return '';
    // Map category names to icons
    const iconMap = {
      'nature': '🌿',
      'city': '🏙️',
      'beach': '🏖️',
      'mountain': '⛰️',
      'historical': '🏛️',
      'food': '🍽️',
      'adventure': '🎯',
      'cultural': '🎭'
    };
    return iconMap[category.name?.toLowerCase()] || '📍';
  }

  // Highlight matching text in results
  function highlightMatch(text, term) {
    if (!term) return text;

    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 font-medium">{part}</span>
      ) : (
        part
      )
    );
  }

  const isSelected = (locId) => selectedIds.includes(locId);
  const isExcluded = (locId) => excludeIds.includes(locId);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Visited Only Filter */}
      <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={visitedOnly}
          onChange={(e) => setVisitedOnly(e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <span>Visited locations only</span>
      </label>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          {/* Results count */}
          <div className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-200">
            {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
          </div>

          {/* Results list */}
          <ul className="max-h-60 overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <li className="px-3 py-3 text-gray-500 text-sm">
                No locations match your search
              </li>
            ) : (
              filteredLocations.map((loc, index) => {
                const excluded = isExcluded(loc.id);
                const selected = isSelected(loc.id);
                const highlighted = index === highlightedIndex;

                return (
                  <li
                    key={loc.id}
                    onClick={() => !excluded && handleSelect(loc)}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center gap-2
                      ${highlighted && !excluded ? 'bg-primary/10' : ''}
                      ${excluded ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${selected && multiSelect ? 'bg-primary/5' : ''}
                    `}
                  >
                    {/* Multi-select checkbox */}
                    {multiSelect && (
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={excluded}
                        readOnly
                        className="w-4 h-4 text-primary border-gray-300 rounded"
                      />
                    )}

                    {/* Category icon */}
                    <span className="text-base">
                      {getCategoryIcon(loc.category)}
                    </span>

                    {/* Location name with highlighted match */}
                    <span className={`flex-1 ${excluded ? 'line-through' : ''}`}>
                      {highlightMatch(loc.name, searchTerm)}
                    </span>

                    {/* Country */}
                    {loc.country_name && (
                      <span className="text-xs text-gray-400">
                        {loc.country_name}
                      </span>
                    )}

                    {/* Visited indicator */}
                    {loc.has_visited && (
                      <span className="text-xs text-green-600" title="Visited">
                        ✓
                      </span>
                    )}

                    {/* Already linked indicator */}
                    {excluded && (
                      <span className="text-xs text-gray-400">(linked)</span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableLocationSelect;
