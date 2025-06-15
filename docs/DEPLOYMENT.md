
# Deployment Guide

## Quick Deployment with Lovable

The easiest way to deploy this application is through Lovable:

1. Click the "Publish" button in the top right of the Lovable editor
2. Your app will be deployed to a Lovable subdomain (e.g., `yourapp.lovable.app`)
3. You can connect a custom domain in Project Settings > Domains (requires paid plan)

## GitHub Integration

### Connecting to GitHub

1. In Lovable, click "GitHub" → "Connect to GitHub"
2. Authorize the Lovable GitHub App
3. Select your GitHub account/organization
4. Click "Create Repository" to generate a new repo with your code

### Manual GitHub Setup

If you prefer to set up GitHub manually:

1. Create a new repository on GitHub
2. Clone this project locally
3. Add your GitHub repo as the remote origin
4. Push your code to GitHub

```bash
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Environment Variables for Production

When deploying to production, make sure to set these environment variables:

```env
VITE_GRAPHQL_ENDPOINT=https://your-production-graphql-endpoint.com/graphql
VITE_GRAPHQL_AUTH_TOKEN=your-production-auth-token
VITE_AUTH_TYPE=bearer
```

## Alternative Deployment Options

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on each push

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings: `npm run build` and publish directory: `dist`

### Manual Deployment
1. Run `npm run build` to create production build
2. Upload the `dist` folder to your web server
3. Configure your server to serve the `index.html` for all routes (SPA routing)

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test GraphQL API connectivity
- [ ] Check that all routes work correctly
- [ ] Verify responsive design on mobile devices
- [ ] Test accessibility features
- [ ] Monitor console for any errors
