# Getting Started

Welcome to the Micro-Frontend Project! This guide will help you set up your development environment and get the application running.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 18 or higher (Recommended: Latest LTS)
- **npm**: Comes with Node.js

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd micro-frontend
    ```

2.  **Install dependencies:**
    Run the following command in the root directory to install dependencies for all applications (Host, Remotes, and Shared Utils):
    ```bash
    npm run install:all
    ```

## Running the Application

To start all applications simultaneously in development mode, run:

```bash
npm run dev:all
```

This command will:

- Clean up temporary files.
- Open new tabs in your terminal (using Windows Terminal `wt` or similar command setup) for:
  - `shared-utils` (Port: 5003)
  - `remote-app-1` (Port: 5001)
  - `remote-app-2` (Port: 5002)
  - `host-app` (Port: 5000)

Access the Host Application at [http://localhost:5000](http://localhost:5000).

## Building for Production

To build all applications for production:

```bash
npm run build:all
```

## Linting

To run linting across all projects:

```bash
npm run lint:all
```
