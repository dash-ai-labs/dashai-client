![dashai-client](https://socialify.git.ci/dash-ai-labs/dashai-client/image?forks=1&issues=1&logo=https%3A%2F%2Fgetdash.ai%2Fbig_logo.png&name=1&owner=1&pattern=Charlie+Brown&pulls=1&stargazers=1&theme=Dark)

<p align="center"><b>Supercharge your email productivity</b></p>


> [!WARNING]
>
> 🚧 Work in Progress 🚧
> 
> This project is still in its early stages, it's rough around the edges. 
>
> We're building in public because that's the best way to make something great. Each bug report shows us what to fix. Each issue points to what matters.
>
> If you like seeing ideas grow from raw to remarkable, stick around. Your feedback shapes what this becomes.

[![Netlify Status](https://api.netlify.com/api/v1/badges/e2e99e76-e3a4-4043-be78-d9a1a19683ff/deploy-status)](https://app.netlify.com/sites/dashaiclient/deploys)
![GitHub last commit](https://img.shields.io/github/last-commit/dash-ai-labs/dashai-client)
[![](https://dcbadge.limes.pink/api/server/BbDjwtf9sK)](https://discord.gg/BbDjwtf9sK)


## Installation

1. Clone the repository:
```bash
git clone https://github.com/dash-ai-labs/dash-client.git
cd dash-client
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn
```

3. Create a `.env` file in the root directory:
```env
# Your server URL
PUBLIC_API_URL=<api_url>

# Your Google Client ID
PUBLIC_GOOGLE_CLIENT_ID=<google_client_id>
```

## Development

Start the development server:

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Features

- Google Sign In
- Multiple email support
- AI powered email search
- Email filtering
- Email sending
- Email labels

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PUBLIC_API_URL | API URL | - |
| PUBLIC_GOOGLE_CLIENT_ID | Google Client ID | - |

> Note: To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
