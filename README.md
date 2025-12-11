# ZenTask - Minimalist Collaborative Task Manager

A breathtakingly beautiful, minimalist to-do application featuring drag-and-drop organization, shareable lists, and edge-based persistence. ZenTask is designed to bring clarity and focus to your daily workflow through a "less is more" philosophy.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlexsibleAdmin/zentask-minimalist-collaborative-task-manager)

## ✨ Key Features

- **Smart Task Entry**: A natural language-inspired input field that feels conversational and intuitive.
- **Fluid Organization**: Seamless drag-and-drop reordering powered by `@dnd-kit` for intuitive prioritization.
- **Collaborative Spaces**: Unique, shareable lists that allow users to manage tasks individually or collaboratively via URL sharing.
- **Edge Persistence**: Data is stored in Cloudflare Durable Objects, ensuring low-latency access and real-time-like synchronization.
- **Visual Excellence**: A "Soft Minimalism" design language utilizing generous whitespace, sophisticated typography, and subtle motion design.
- **Focus Mode**: A dedicated view designed to help you focus on one task at a time.
- **Contextual Actions**: Interface remains clean with actions revealed only upon interaction.

## 🛠️ Technology Stack

**Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router 6

**Backend & Infrastructure**
- **Runtime**: Cloudflare Workers
- **API Framework**: Hono
- **Storage**: Cloudflare Durable Objects
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (v1.0 or later)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) CLI (`npm install -g wrangler`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zentask-ui.git
   cd zentask-ui
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Start the local development server. This runs both the React frontend and the Cloudflare Worker backend locally using Vite and Wrangler.

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

## 📦 Deployment

ZenTask is built to run on Cloudflare's edge network. You can deploy it directly to your Cloudflare account.

### One-Click Deploy

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlexsibleAdmin/zentask-minimalist-collaborative-task-manager)

### Manual Deployment

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy the application:
   ```bash
   bun run deploy
   ```

This command builds the frontend assets and deploys the Worker with the Durable Object configuration.

## 🏗️ Architecture Overview

ZenTask follows a modern edge architecture:

1. **Client**: The React application generates a unique `listId` (UUID) upon arrival.
2. **State**: `useTaskStore` (Zustand) manages local state with optimistic updates for instant feedback.
3. **API Layer**: Requests are sent to a Hono-based Worker, partitioned by `listId`.
4. **Persistence**: The Worker routes requests to a specific Cloudflare Durable Object instance, which handles storage and consistency.
5. **Sync**: Data is persisted to the Durable Object's transactional storage, ensuring reliability across sessions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.