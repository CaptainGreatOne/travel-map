// Sample location data with new 5-category system
// This will be replaced with Supabase data later

// Categories with colors for dynamic theming
export const categories = [
  {
    id: 'nature',
    name: 'Nature & Outdoors',
    icon: '🌲',
    colorHex: '#4CAF50', // Green
    colorName: 'green'
  },
  {
    id: 'city',
    name: 'Cities & Towns',
    icon: '🏙️',
    colorHex: '#2196F3', // Blue
    colorName: 'blue'
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍴',
    colorHex: '#F44336', // Red
    colorName: 'red'
  },
  {
    id: 'culture',
    name: 'Culture & History',
    icon: '🎨',
    colorHex: '#9C27B0', // Purple
    colorName: 'violet'
  },
  {
    id: 'beach',
    name: 'Beaches & Islands',
    icon: '🏖️',
    colorHex: '#FFC107', // Yellow
    colorName: 'yellow'
  }
];

export const sampleLocations = [
  {
    id: 1,
    slug: 'reykjavik-iceland',
    name: "Reykjavik, Iceland",
    latitude: 64.1466,
    longitude: -21.9426,
    category: "city",
    has_visited: true,
    date_visited: "2024-06-15",
    short_description: "Vibrant capital with northern lights and hot springs",
    notes: "Amazing northern lights and geothermal pools"
  },
  {
    id: 2,
    slug: 'kyoto-japan',
    name: "Kyoto, Japan",
    latitude: 35.0116,
    longitude: 135.7681,
    category: "culture",
    has_visited: true,
    date_visited: "2023-03-20",
    short_description: "Ancient temples and traditional Japanese culture",
    notes: "Beautiful temples and traditional culture"
  },
  {
    id: 3,
    slug: 'patagonia-argentina',
    name: "Patagonia, Argentina",
    latitude: -50.3375,
    longitude: -72.2489,
    category: "nature",
    has_visited: false,
    short_description: "Epic hiking trails and massive glaciers",
    notes: "Epic hiking and glaciers - bucket list!"
  },
  {
    id: 4,
    slug: 'santorini-greece',
    name: "Santorini, Greece",
    latitude: 36.3932,
    longitude: 25.4615,
    category: "beach",
    has_visited: false,
    short_description: "Stunning sunsets and white-washed buildings",
    notes: "Sunset views and white-washed buildings"
  },
  {
    id: 5,
    slug: 'banff-canada',
    name: "Banff National Park, Canada",
    latitude: 51.4968,
    longitude: -115.9281,
    category: "nature",
    has_visited: true,
    date_visited: "2024-08-10",
    short_description: "Turquoise mountain lakes and wildlife",
    notes: "Stunning mountain lakes and wildlife"
  },
  {
    id: 6,
    slug: 'tokyo-tsukiji',
    name: "Tsukiji Fish Market, Tokyo",
    latitude: 35.6654,
    longitude: 139.7707,
    category: "food",
    has_visited: true,
    date_visited: "2023-03-18",
    short_description: "World-famous fish market and sushi",
    notes: "Fresh sushi breakfast at 5am - incredible!"
  },
  {
    id: 7,
    slug: 'machu-picchu',
    name: "Machu Picchu, Peru",
    latitude: -13.1631,
    longitude: -72.5450,
    category: "culture",
    has_visited: false,
    short_description: "Ancient Incan citadel in the mountains",
    notes: "Must do the Inca Trail hike"
  },
  {
    id: 8,
    slug: 'bali-beaches',
    name: "Seminyak Beach, Bali",
    latitude: -8.6905,
    longitude: 115.1669,
    category: "beach",
    has_visited: true,
    date_visited: "2024-02-10",
    short_description: "Perfect surfing and beach sunsets",
    notes: "Best sunset beach in Bali"
  },
  {
    id: 9,
    slug: 'yosemite',
    name: "Yosemite National Park, USA",
    latitude: 37.8651,
    longitude: -119.5383,
    category: "nature",
    has_visited: true,
    date_visited: "2023-07-04",
    short_description: "Iconic granite cliffs and waterfalls",
    notes: "Half Dome hike was challenging but worth it"
  },
  {
    id: 10,
    slug: 'paris-louvre',
    name: "Louvre Museum, Paris",
    latitude: 48.8606,
    longitude: 2.3376,
    category: "culture",
    has_visited: false,
    short_description: "World's largest art museum",
    notes: "Need at least 2 full days to see everything"
  }
];

// Sample featured photos for Photography page
export const featuredPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    title: 'Mountain Sunrise',
    location: 'Swiss Alps, Switzerland'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
    title: 'Forest Path',
    location: 'Pacific Northwest, USA'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200',
    title: 'Coastal Sunset',
    location: 'Big Sur, California'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
    title: 'Lake Reflection',
    location: 'Patagonia, Argentina'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200',
    title: 'Desert Dunes',
    location: 'Sahara Desert, Morocco'
  }
];