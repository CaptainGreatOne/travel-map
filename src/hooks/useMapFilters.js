import React, { useState, useMemo, useEffect } from 'react';

/**
 * Custom hook that encapsulates all filter-related state and logic for MapPage.
 *
 * @param {Array} locations - Array of location objects
 * @param {Array} categoryData - Array of category objects
 * @returns {Object} Filter state, computed values, and handlers
 */
export function useMapFilters(locations, categoryData) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Separate filter states - both are remembered when switching color schemes
  const [selectedStatuses, setSelectedStatuses] = useState(['visited', 'want-to-visit']); // Both selected by default
  const [selectedCategories, setSelectedCategories] = useState(() => categoryData.map(c => c.id)); // All selected by default

  const [mapStyle, setMapStyle] = useState('standard');
  const [colorScheme, setColorScheme] = useState('status'); // 'status' or 'category'

  // Search and country filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Auto-select new categories when category data changes (e.g., after DB load)
  // Using a ref to track previously seen category IDs avoids setState in the effect body
  const prevCategoryIdsRef = React.useRef(new Set(categoryData.map(c => c.id)));
  useEffect(() => {
    const currentCategoryIds = categoryData.map(c => c.id);
    const prevIds = prevCategoryIdsRef.current;
    const newCategories = currentCategoryIds.filter(id => !prevIds.has(id));

    if (newCategories.length > 0) {
      setSelectedCategories(prev => [...prev, ...newCategories]);
    }

    // Update the ref with current IDs for next comparison
    prevCategoryIdsRef.current = new Set(currentCategoryIds);
  }, [categoryData]);

  // Helper to check if location has valid coordinates
  const hasValidCoordinates = (loc) => {
    const lat = parseFloat(loc.latitude);
    const lng = parseFloat(loc.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  // Filter to only locations with valid coordinates for counting/display
  const validLocations = useMemo(() => {
    return locations.filter(hasValidCoordinates);
  }, [locations]);

  // Compute unique countries from validLocations (follow admin pattern)
  const uniqueCountries = useMemo(() => {
    return validLocations
      .filter(loc => loc.country_code != null)
      .reduce((acc, loc) => {
        if (!acc.find(c => c.code === loc.country_code)) {
          acc.push({ code: loc.country_code, name: loc.country || loc.country_code });
        }
        return acc;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [validLocations]);

  // Calculate category counts (only valid locations)
  const categoriesWithCounts = useMemo(() => {
    return categoryData.map(category => ({
      ...category,
      count: validLocations.filter(loc => (loc.category?.id || loc.category) === category.id).length
    }));
  }, [validLocations, categoryData]);

  // Filter locations based on ACTIVE color scheme's filters (uses validLocations)
  const filteredLocations = useMemo(() => {
    return validLocations.filter(loc => {
      // Search filter: case-insensitive search by location name
      const matchesSearch = !searchQuery ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Country filter: check if location country_code matches countryFilter
      const matchesCountry = !countryFilter || loc.country_code === countryFilter;

      // Status/category filter based on active color scheme
      let matchesScheme;
      if (colorScheme === 'status') {
        // When in status mode, filter by status only
        const isVisited = loc.has_visited;
        matchesScheme =
          (isVisited && selectedStatuses.includes('visited')) ||
          (!isVisited && selectedStatuses.includes('want-to-visit'));
      } else {
        // When in category mode, filter by category only
        matchesScheme = selectedCategories.includes(loc.category?.id || loc.category);
      }

      // Combine all filters with AND logic
      return matchesSearch && matchesCountry && matchesScheme;
    });
  }, [validLocations, colorScheme, selectedStatuses, selectedCategories, searchQuery, countryFilter]);

  // Toggle status selection
  const handleToggleStatus = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        // Don't allow deselecting all statuses
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Count visited/want to visit (only valid locations)
  const visitedCount = validLocations.filter(loc => loc.has_visited).length;
  const wantToVisitCount = validLocations.filter(loc => !loc.has_visited).length;

  // Toggle category selection
  const handleToggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Don't allow deselecting all categories
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Get category info for display
  const getCategoryInfo = (categoryId) => {
    return categoriesWithCounts.find(c => c.id === categoryId);
  };

  return {
    // Filter state
    selectedStatuses,
    selectedCategories,
    mapStyle,
    colorScheme,
    filtersOpen,
    searchQuery,
    countryFilter,
    // Computed values
    categoriesWithCounts,
    filteredLocations,
    visitedCount,
    wantToVisitCount,
    uniqueCountries,
    // Handlers
    handleToggleStatus,
    handleToggleCategory,
    setMapStyle,
    setColorScheme,
    setFiltersOpen,
    setSearchQuery,
    setCountryFilter,
    getCategoryInfo
  };
}

export default useMapFilters;
