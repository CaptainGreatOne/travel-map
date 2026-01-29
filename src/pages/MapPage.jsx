import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

function MapPage() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  const {
    selectedStatuses, selectedCategories, mapStyle, colorScheme, filtersOpen,
    categoriesWithCounts, filteredLocations, visitedCount, wantToVisitCount,
    handleToggleStatus, handleToggleCategory, setMapStyle, setColorScheme, setFiltersOpen,
    getCategoryInfo,
    searchQuery, setSearchQuery, countryFilter, setCountryFilter, uniqueCountries
  } = useMapFilters(locations, categories);

  const [showingSuggestionForm, setShowingSuggestionForm] = useState(null);
  const [suggestionSuccess, setSuggestionSuccess] = useState(null);

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
              >
                <Popup
                  onClose={() => {
                    setShowingSuggestionForm(null);
                    setSuggestionSuccess(null);
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
