# Travel Map

Interactive companion app for a travel vlog YouTube channel. Explore 600+ location markers on an interactive map, discover videos, and submit your own location suggestions.

## Features

- **Interactive Leaflet Map** - Browse 600+ location markers with clustering for better performance
- **Category & Status Filtering** - Filter by location type (nature, city, food, etc.) and visited status
- **Location Suggestions** - Authenticated users can suggest new locations via Google Maps URL
- **Photography Gallery** - Browse travel photos with admin CMS for management
- **About Page** - Dynamic stats, bio content, and Instagram feed integration
- **Admin Panel** - Full content management for locations, videos, suggestions, and photos

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet + react-leaflet + react-leaflet-cluster
- **Backend:** Supabase (Auth, Database, Storage)
- **Testing:** Vitest + React Testing Library

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd trave-map

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# See docs/ENVIRONMENT.md for detailed setup instructions

# Start development server
npm run dev
```

## Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed environment variable documentation.

**Required variables:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_ADMIN_EMAILS` - Comma-separated list of admin email addresses

## Database Setup

### Fresh Deployment

For new projects, run the consolidated schema file in Supabase SQL Editor:

```bash
# File: supabase/seed.sql
# Contains all tables, policies, and initial data
```

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste contents of `supabase/seed.sql`
4. Run the query

### Incremental Updates

Individual migration files are in `supabase/migrations/` for reference and incremental updates to existing databases.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
├── index.css         # Global styles (Tailwind)
├── components/       # React components
│   ├── admin/        # Admin panel components
│   ├── map/          # Map-related components
│   ├── layout/       # Layout components (Header, Sidebar)
│   └── ui/           # Reusable UI components
├── pages/            # Page components (About, Photography, Admin)
├── contexts/         # React contexts (Auth)
├── hooks/            # Custom React hooks
├── services/         # Supabase service layer
├── utils/            # Utility functions
├── data/             # Static data (sample locations, categories)
└── test/             # Test setup and utilities
```

## Admin Access

Users whose email is in `VITE_ADMIN_EMAILS` will see an Admin menu item in the navigation. Admin features include:

- **Location Management** - Add, edit, delete locations
- **Video Management** - Link YouTube videos to locations
- **Suggestion Moderation** - Review and approve/reject user suggestions
- **Photo Management** - Upload and manage photography gallery
- **About Page Editor** - Update bio, social links, and stats

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

---

Built with React, Leaflet, and Supabase.
