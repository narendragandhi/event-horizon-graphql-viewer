
# Event Listing Application

A modern, accessible event listing application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎯 **Event Discovery**: Browse and search events with advanced filtering
- 📅 **Calendar Integration**: Interactive date picker for event filtering
- 🔍 **Smart Search**: Search events by title, description, or tags
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile
- ♿ **Accessibility First**: Built with accessibility best practices
- 🚀 **Performance Optimized**: Efficient data fetching and caching
- 🔌 **GraphQL Ready**: Configurable GraphQL API integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **API**: GraphQL with configurable endpoints
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) A GraphQL API endpoint

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd event-listing-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (optional)
```bash
cp .env.example .env
# Edit .env with your GraphQL endpoint and authentication details
```

4. Start the development server
```bash
npm run dev
```

Visit `http://localhost:8080` to see the application.

## Configuration

### GraphQL API Setup

See [GraphQL Setup Guide](./GRAPHQL_SETUP.md) for detailed configuration instructions.

### Mock Data

The application includes mock data for development. If no GraphQL endpoint is configured, it will automatically use mock data.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── EventCard.tsx   # Event display component
│   ├── EventList.tsx   # Event listing component
│   ├── FilterPanel.tsx # Search and filter controls
│   └── SearchBar.tsx   # Search input component
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── EventDetails.tsx # Event detail page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Deployment

See [Deployment Guide](./DEPLOYMENT.md) for deployment instructions.

## Accessibility

This application is built with accessibility in mind:

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
