# DASH client

Client for DASH - AI dashboard for email.
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
# Server Configuration
PUBLIC_API_URL=<api_url>
PUBLIC_GOOGLE_CLIENT_ID=<google_client_id>
```

## Development

Start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Features

- Adaptive bitrate streaming using DASH
- Support for multiple video qualities
- Automatic quality selection based on network conditions
- Custom quality selection controls
- Buffer management

## Requirements

- Modern web browser with MSE (Media Source Extensions) support
- Node.js 16.x or higher
- Internet connection for streaming

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PUBLIC_API_URL | API URL | - |
| PUBLIC_GOOGLE_CLIENT_ID | Google Client ID | - |

> Note: To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
