
# GraphQL Configuration Guide

This application supports both mock data and real GraphQL API endpoints. Here's how to configure it:

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# GraphQL API Configuration
VITE_GRAPHQL_ENDPOINT=https://your-graphql-endpoint.com/graphql
VITE_GRAPHQL_API_KEY=your-api-key-here
VITE_GRAPHQL_AUTH_TOKEN=your-auth-token-here

# Optional: Authentication type (bearer, api-key, basic)
VITE_AUTH_TYPE=bearer
```

## Configuration Options

### Endpoint Configuration
- `VITE_GRAPHQL_ENDPOINT`: Your GraphQL API endpoint URL
- If not provided, defaults to `http://localhost:4000/graphql`

### Authentication
The application supports multiple authentication methods:

#### Bearer Token Authentication
```env
VITE_AUTH_TYPE=bearer
VITE_GRAPHQL_AUTH_TOKEN=your-jwt-token-here
```

#### API Key Authentication
```env
VITE_AUTH_TYPE=api-key
VITE_GRAPHQL_API_KEY=your-api-key-here
```

## GraphQL Schema Requirements

Your GraphQL API should support the following queries:

### Get Events Query
```graphql
query GetEvents($filters: EventFilters) {
  events(filters: $filters) {
    id
    title
    description
    date
    time
    location
    category
    price
    capacity
    imageUrl
    organizer
    tags
    isVirtual
  }
}
```

### Get Event by ID Query
```graphql
query GetEvent($id: ID!) {
  event(id: $id) {
    id
    title
    description
    date
    time
    location
    category
    price
    capacity
    imageUrl
    organizer
    tags
    isVirtual
  }
}
```

### Filter Types
```graphql
input EventFilters {
  category: String
  location: String
  dateRange: DateRangeInput
  searchTerm: String
}

input DateRangeInput {
  start: String
  end: String
}
```

## Mock Data Mode

If no real GraphQL endpoint is configured, the application will automatically use mock data. This is useful for:
- Development and testing
- Demos and presentations
- Offline development

## Testing Your Configuration

1. Set your environment variables
2. Restart your development server
3. Check the browser console for any GraphQL errors
4. Verify events are loading correctly

## Common Issues

### CORS Errors
If you encounter CORS errors, ensure your GraphQL server is configured to accept requests from your domain.

### Authentication Errors
- Verify your API key or token is correct
- Check that the authentication type matches your server's requirements
- Ensure your token hasn't expired

### Network Errors
- Verify your endpoint URL is correct
- Check that your GraphQL server is running
- Test your endpoint with a GraphQL client like GraphiQL or Insomnia
