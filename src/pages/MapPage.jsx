import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from '../components/MapLegend';
import MarkerPopup from '../components/MarkerPopup';
import SidebarFilters from '../components/SidebarFilters';
import MapErrorBoundary from '../components/MapErrorBoundary';
import { useAuth } from '../contexts/AuthContext';
import { useMapFilters } from '../hooks/useMapFilters';
import { mapStyles, getMarkerIcon } from '../utils/mapStyles';
import { fetchLocations, fetchCategories } from '../services/locationService';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to control map view
function MapViewController({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.latitude, selectedLocation.longitude], 12);
    }
  }, [selectedLocation, map]);

  return null;
}

function MapPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setLoadError(null);

      const [dbLocations, dbCategories] = await Promise.all([
        fetchLocations(),
        fetchCategories()
      ]);

      if (dbLocations) {
        setLocations(dbLocations);
      } else {
        // TODO: Decide how to handle location loading failures
        // Options: show error message, retry button, offline mode with cached data
        setLoadError('Unable to load locations');
      }

      if (dbCategories) {
        setCategories(dbCategories);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  // Handle URL location parameter
  useEffect(() => {
    const locationSlug = searchParams.get('location');
    if (locationSlug && locations.length > 0) {
      const matchingLocation = locations.find(loc => loc.slug === locationSlug);
      if (matchingLocation) {
        setSelectedLocation(matchingLocation);
      } else {
        // Invalid slug - clear URL param silently
        setSearchParams({});
      }
    }
  }, [locations, searchParams, setSearchParams]);

  const {
    selectedStatuses, selectedCategories, mapStyle, colorScheme, filtersOpen,
    categoriesWithCounts, filteredLocations, visitedCount, wantToVisitCount,
    handleToggleStatus, handleToggleCategory, setMapStyle, setColorScheme, setFiltersOpen,
    getCategoryInfo,
    searchQuery, setSearchQuery, countryFilter, setCountryFilter, uniqueCountries
  } = useMapFilters(locations, categories);

  const [showingSuggestionForm, setShowingSuggestionForm] = useState(null);
  const [suggestionSuccess, setSuggestionSuccess] = useState(null);

  // Programmatically open popup when selectedLocation is set
  useEffect(() => {
    if (selectedLocation && markerRefs.current[selectedLocation.id]) {
      // Small timeout to ensure marker is rendered
      setTimeout(() => {
        markerRefs.current[selectedLocation.id]?.openPopup();
      }, 100);
    }
  }, [selectedLocation, filteredLocations]);

  const sidebarFilters = (
    <SidebarFilters
      filtersOpen={filtersOpen}
      setFiltersOpen={setFiltersOpen}
      mapStyle={mapStyle}
      setMapStyle={setMapStyle}
      colorScheme={colorScheme}
      setColorScheme={setColorScheme}
      selectedStatuses={selectedStatuses}
      handleToggleStatus={handleToggleStatus}
      visitedCount={visitedCount}
      wantToVisitCount={wantToVisitCount}
      categoriesWithCounts={categoriesWithCounts}
      selectedCategories={selectedCategories}
      handleToggleCategory={handleToggleCategory}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      countryFilter={countryFilter}
      setCountryFilter={setCountryFilter}
      uniqueCountries={uniqueCountries}
    />
  );

  const mapContent = (
    <MapErrorBoundary>
      <div className="flex-1 relative isolate z-0 h-[calc(100vh-56px)] lg:h-screen w-full lg:w-[calc(100vw-280px)]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
        >
          <TileLayer
            key={mapStyle}
            attribution={mapStyles[mapStyle].attribution}
            url={mapStyles[mapStyle].url}
          />

          <MapViewController selectedLocation={selectedLocation} />

          <MarkerClusterGroup
            chunkedLoading={true}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            maxClusterRadius={50}
          >
            {filteredLocations.map(location => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={getMarkerIcon(location, colorScheme, categoriesWithCounts)}
                ref={(ref) => { if (ref) markerRefs.current[location.id] = ref; }}
                eventHandlers={{
                  click: () => {
                    setSearchParams({ location: location.slug });
                  }
                }}
              >
                <Popup
                  onClose={() => {
                    setShowingSuggestionForm(null);
                    setSuggestionSuccess(null);
                    setSearchParams({});
                    setSelectedLocation(null);
                  }}
                >
                  <MarkerPopup
                    location={location}
                    categoryInfo={getCategoryInfo(location.category)}
                    videos={location.videos || []}
                    isShowingForm={showingSuggestionForm === location.id}
                    isSuccess={suggestionSuccess === location.id}
                    user={user}
                    onShowForm={() => setShowingSuggestionForm(location.id)}
                    onCancelForm={() => setShowingSuggestionForm(null)}
                    onSuccess={() => {
                      setShowingSuggestionForm(null);
                      setSuggestionSuccess(location.id);
                      setTimeout(() => setSuggestionSuccess(null), 5000);
                    }}
                  />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        <MapLegend
          colorScheme={colorScheme}
          categories={categoriesWithCounts}
          visitedCount={visitedCount}
          wantToVisitCount={wantToVisitCount}
        />
      </div>
    </MapErrorBoundary>
  );

  return {
    filters: sidebarFilters,
    content: mapContent
  };
}

export function MapPageWrapper() {
  const mapPage = MapPage();
  return (
    <>
      {mapPage.filters}
      {mapPage.content}
    </>
  );
}

export default MapPage;
