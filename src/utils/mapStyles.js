import L from 'leaflet';

/**
 * Map tile style configurations.
 * Each style has a URL template and attribution text.
 */
export const mapStyles = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  terrain: {
    url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri'
  },
  watercolor: {
    url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  }
};

/**
 * Helper function to create custom colored marker icons.
 * Uses leaflet-color-markers from GitHub.
 *
 * @param {string} colorName - Color name (e.g., 'green', 'blue', 'red', 'violet', 'yellow', 'grey')
 * @returns {L.Icon} Leaflet icon instance
 */
export function createColoredIcon(colorName) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colorName}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

/**
 * Get marker icon based on color scheme and location data.
 *
 * @param {Object} location - Location object with has_visited and category fields
 * @param {string} colorScheme - 'status' or 'category'
 * @param {Array} categoriesWithCounts - Categories array with colorName field
 * @returns {L.Icon} Leaflet icon instance
 */
export function getMarkerIcon(location, colorScheme, categoriesWithCounts) {
  if (colorScheme === 'status') {
    return location.has_visited
      ? createColoredIcon('green')
      : createColoredIcon('blue');
  } else {
    // Handle both string category ID and object from DB join
    const categoryId = location.category?.id || location.category;
    const category = categoriesWithCounts.find(c => c.id === categoryId);
    // Handle both camelCase (sampleData) and snake_case (DB) field names
    const colorName = category?.colorName || category?.color_name || 'grey';
    return createColoredIcon(colorName);
  }
}

export default mapStyles;
