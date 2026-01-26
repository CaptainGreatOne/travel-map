import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMapFilters from './useMapFilters';

describe('useMapFilters', () => {
  const mockCategories = [
    { id: 'nature', name: 'Nature', color: '#22c55e' },
    { id: 'city', name: 'City', color: '#3b82f6' },
    { id: 'food', name: 'Food', color: '#f59e0b' },
  ];

  const mockLocations = [
    { id: '1', name: 'Forest Park', category: 'nature', has_visited: true, latitude: '45.5', longitude: '-122.7' },
    { id: '2', name: 'Downtown', category: 'city', has_visited: false, latitude: '45.5', longitude: '-122.6' },
    { id: '3', name: 'Sushi Place', category: 'food', has_visited: true, latitude: '45.5', longitude: '-122.5' },
    { id: '4', name: 'Mountain Trail', category: 'nature', has_visited: false, latitude: '45.6', longitude: '-122.7' },
  ];

  describe('initial state', () => {
    it('selects all categories by default', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.selectedCategories).toEqual(['nature', 'city', 'food']);
    });

    it('selects both statuses by default', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.selectedStatuses).toEqual(['visited', 'want-to-visit']);
    });

    it('starts with filters open', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.filtersOpen).toBe(true);
    });

    it('starts with status color scheme', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.colorScheme).toBe('status');
    });

    it('starts with standard map style', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.mapStyle).toBe('standard');
    });
  });

  describe('toggleCategory', () => {
    it('removes category when selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.handleToggleCategory('nature');
      });

      expect(result.current.selectedCategories).toEqual(['city', 'food']);
    });

    it('adds category when not selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      // First deselect a category
      act(() => {
        result.current.handleToggleCategory('nature');
      });

      // Then re-select it
      act(() => {
        result.current.handleToggleCategory('nature');
      });

      expect(result.current.selectedCategories).toContain('nature');
    });

    it('prevents deselecting all categories', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      // Deselect all but one
      act(() => {
        result.current.handleToggleCategory('nature');
        result.current.handleToggleCategory('city');
      });

      // Only food left, try to deselect
      expect(result.current.selectedCategories).toEqual(['food']);

      act(() => {
        result.current.handleToggleCategory('food');
      });

      // Should still have food selected
      expect(result.current.selectedCategories).toEqual(['food']);
    });
  });

  describe('toggleStatus', () => {
    it('removes status when selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.handleToggleStatus('visited');
      });

      expect(result.current.selectedStatuses).toEqual(['want-to-visit']);
    });

    it('adds status when not selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      // First deselect
      act(() => {
        result.current.handleToggleStatus('visited');
      });

      // Then re-select
      act(() => {
        result.current.handleToggleStatus('visited');
      });

      expect(result.current.selectedStatuses).toContain('visited');
    });

    it('prevents deselecting all statuses', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      // Deselect one status
      act(() => {
        result.current.handleToggleStatus('visited');
      });

      expect(result.current.selectedStatuses).toEqual(['want-to-visit']);

      // Try to deselect the last one
      act(() => {
        result.current.handleToggleStatus('want-to-visit');
      });

      // Should still have one selected
      expect(result.current.selectedStatuses).toEqual(['want-to-visit']);
    });
  });

  describe('filter logic in status mode', () => {
    it('shows all locations when both statuses selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.filteredLocations).toHaveLength(4);
    });

    it('shows only visited locations when visited status selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.handleToggleStatus('want-to-visit');
      });

      expect(result.current.filteredLocations).toHaveLength(2);
      expect(result.current.filteredLocations.every(loc => loc.has_visited)).toBe(true);
    });

    it('shows only want-to-visit locations when want-to-visit status selected', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.handleToggleStatus('visited');
      });

      expect(result.current.filteredLocations).toHaveLength(2);
      expect(result.current.filteredLocations.every(loc => !loc.has_visited)).toBe(true);
    });
  });

  describe('filter logic in category mode', () => {
    it('filters by category when in category color scheme', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.setColorScheme('category');
      });

      expect(result.current.filteredLocations).toHaveLength(4);
    });

    it('shows only selected category locations', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.setColorScheme('category');
        result.current.handleToggleCategory('city');
        result.current.handleToggleCategory('food');
      });

      expect(result.current.filteredLocations).toHaveLength(2);
      expect(result.current.filteredLocations.every(loc => loc.category === 'nature')).toBe(true);
    });
  });

  describe('computed values', () => {
    it('calculates visited count correctly', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.visitedCount).toBe(2);
    });

    it('calculates want to visit count correctly', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      expect(result.current.wantToVisitCount).toBe(2);
    });

    it('calculates category counts correctly', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      const natureCategory = result.current.categoriesWithCounts.find(c => c.id === 'nature');
      const cityCategory = result.current.categoriesWithCounts.find(c => c.id === 'city');
      const foodCategory = result.current.categoriesWithCounts.find(c => c.id === 'food');

      expect(natureCategory.count).toBe(2);
      expect(cityCategory.count).toBe(1);
      expect(foodCategory.count).toBe(1);
    });

    it('getCategoryInfo returns correct category', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      const info = result.current.getCategoryInfo('nature');

      expect(info.id).toBe('nature');
      expect(info.name).toBe('Nature');
      expect(info.count).toBe(2);
    });
  });

  describe('coordinate validation', () => {
    it('excludes locations with invalid coordinates', () => {
      const locationsWithInvalid = [
        ...mockLocations,
        { id: '5', name: 'Invalid', category: 'nature', has_visited: true, latitude: 'invalid', longitude: '-122.0' },
        { id: '6', name: 'Out of range', category: 'nature', has_visited: true, latitude: '95', longitude: '-122.0' },
      ];

      const { result } = renderHook(() => useMapFilters(locationsWithInvalid, mockCategories));

      expect(result.current.filteredLocations).toHaveLength(4);
      expect(result.current.visitedCount).toBe(2);
    });
  });

  describe('setters', () => {
    it('setMapStyle changes map style', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.setMapStyle('satellite');
      });

      expect(result.current.mapStyle).toBe('satellite');
    });

    it('setColorScheme changes color scheme', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.setColorScheme('category');
      });

      expect(result.current.colorScheme).toBe('category');
    });

    it('setFiltersOpen toggles filter panel', () => {
      const { result } = renderHook(() => useMapFilters(mockLocations, mockCategories));

      act(() => {
        result.current.setFiltersOpen(false);
      });

      expect(result.current.filtersOpen).toBe(false);
    });
  });

  describe('category data updates', () => {
    it('auto-selects new categories when category data changes', () => {
      const { result, rerender } = renderHook(
        ({ categories }) => useMapFilters(mockLocations, categories),
        { initialProps: { categories: mockCategories } }
      );

      expect(result.current.selectedCategories).toHaveLength(3);

      // Add a new category
      const newCategories = [
        ...mockCategories,
        { id: 'beach', name: 'Beach', color: '#06b6d4' },
      ];

      rerender({ categories: newCategories });

      expect(result.current.selectedCategories).toContain('beach');
      expect(result.current.selectedCategories).toHaveLength(4);
    });
  });

  describe('handles location object category formats', () => {
    it('handles category as object with id', () => {
      const locationsWithCategoryObjects = [
        { id: '1', name: 'Forest', category: { id: 'nature', name: 'Nature' }, has_visited: true, latitude: '45.5', longitude: '-122.7' },
      ];

      const { result } = renderHook(() => useMapFilters(locationsWithCategoryObjects, mockCategories));

      act(() => {
        result.current.setColorScheme('category');
      });

      expect(result.current.filteredLocations).toHaveLength(1);

      const natureCategory = result.current.categoriesWithCounts.find(c => c.id === 'nature');
      expect(natureCategory.count).toBe(1);
    });
  });
});
