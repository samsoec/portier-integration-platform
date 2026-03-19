# Integration Platform

A frontend application for managing third-party platform integrations, built with React Router, TailwindCSS, TanStack Query, and XState.

## Features

- Platform integration listing with status filtering and search
- Platform detail view with sync history
- Sync Now functionality (calls API)
- Conflict resolution dialog for sync operations
- All data (except Sync Now) is mocked/simulated locally

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

Install the dependencies:

```bash
npm install --legacy-peer-deps
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Running Tests

```bash
npm test
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Docker Deployment

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed

### Build and Run

1. **Build the Docker image:**

```bash
docker build -t integration-platform .
```

2. **Run the container:**

```bash
docker run -p 3000:3000 integration-platform
```

3. **Open the application:**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Stop the Container

```bash
docker stop $(docker ps -q --filter ancestor=integration-platform)
```

## Project Structure

```
app/
├── api/              # API layer (Sync Now calls the real API; other data is mocked)
├── components/       # Reusable UI components
├── entities/         # Schemas and types
├── features/         # Feature modules (integration-list, platform-detail)
├── machines/         # XState state machines (sync flow)
├── mocks/            # Mock data
├── providers/        # React context providers
├── routes/           # Route components
└── utils/            # Utility functions
```

## Tech Stack

- **React 19** with **React Router 7** (SPA mode)
- **TailwindCSS 4** for styling
- **TanStack Query** for data fetching
- **XState 4** for sync state management
- **Zod** for schema validation
- **Vitest** + **Testing Library** for testing

## State Machine

Try out our state machine in simulation mode:

[Open in Stately](https://stately.ai/registry/editor/aee52c41-8cca-4059-b6ae-735448026c41?machineId=6dce9973-7cc2-4547-8600-00a38b75b670&mode=Design)

**What is this?**

This is a simulation of our state machine, built using [Stately](https://stately.ai/). You can interact with the machine by sending events and observing the resulting state changes.

**How to use**

1. Click on the simulation link above to open the Stately editor.
2. Send events to the machine by clicking on the event buttons.
3. Observe the resulting state changes in the state chart.
