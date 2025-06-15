
export const graphqlConfig = {
  endpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  apiKey: import.meta.env.VITE_GRAPHQL_API_KEY || '',
  authToken: import.meta.env.VITE_GRAPHQL_AUTH_TOKEN || '',
  authType: import.meta.env.VITE_AUTH_TYPE || 'bearer',
  timeout: 10000,
};

export const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (graphqlConfig.authType === 'bearer' && graphqlConfig.authToken) {
    headers['Authorization'] = `Bearer ${graphqlConfig.authToken}`;
  } else if (graphqlConfig.authType === 'api-key' && graphqlConfig.apiKey) {
    headers['X-API-Key'] = graphqlConfig.apiKey;
  }

  return headers;
};
