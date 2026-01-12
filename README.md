# Micro-Frontend Project

Welcome to the Micro-Frontend Project! This repository demonstrates a scalable frontend architecture using **React**, **Vite**, and **Module Federation**.

## 🚀 Quick Links

- **[Getting Started](./GETTING_STARTED.md)**: Setup and installation instructions.
- **[Project Structure](./PROJECT_STRUCTURE.md)**: Overview of the monorepo layout.
- **[Architecture](./ARCHITECTURE.md)**: Deep dive into how the micro-frontends work together.
- **[Technologies](./TECHNOLOGIES.md)**: The tech stack used in this project.
- **[Tutorial](./TUTORIAL.md)**: How to add and expose new components.
- **[Troubleshooting](./TROUBLESHOOTING.md)**: Solutions to common problems.
- **[Learning Goals](./LEARNING_GOALS.md)**: What you can learn from this codebase.

## 📦 Overview

This project consists of:

- **Host App**: The main container application.
- **Remote Apps**: Independent micro-applications exposed to the Host.
- **Shared Utils**: A common library for types, events, and logic.

## 🛠️ Quick Start

```bash
# Install dependencies
npm run install:all

# Run all applications
npm run dev:all
```

Visit [http://localhost:5000](http://localhost:5000) to see the application in action.
