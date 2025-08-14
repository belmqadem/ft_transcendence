# 🏓 ft_transcendence

## Overview

**ft_transcendence** is a comprehensive social gaming platform built as the final project for the 42 curriculum. This modern web application combines real-time Pong gameplay with social features including chat, user profiles, friend systems, and tournaments. The project demonstrates advanced full-stack development using microservices architecture.

### Key Features

🎮 **Multi-Mode Gaming**

- **Local 1v1**: Face-to-face matches with friends
- **Remote Battles**: Online matches against players worldwide
- **Tournament Mode**: Organized competitive brackets

🔐 **Advanced Authentication**

- Multi-factor authentication (2FA) with TOTP/Email
- OAuth integration (Google, 42 School)
- Secure JWT-based session management

💬 **Real-time Communication**

- Live chat system with WebSocket technology
- Direct messaging between players
- Real-time notifications and updates

👥 **Social Features**

- Friend requests and management
- User blocking and privacy controls
- Live dashboard showing player activity
- Match history and statistics

🎨 **Modern UI/UX**

- Responsive design optimized for desktop gaming
- Dark theme with elegant animations
- Real-time data visualization with Chart.js

---

## Architecture

### Frontend Stack

- **Framework**: Vite + TypeScript for fast development
- **Styling**: TailwindCSS for modern, responsive design
- **State Management**: Custom stores with localStorage persistence
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite with hot module replacement

### Backend Architecture

The backend follows a **microservices pattern** with domain-driven separation:

- **🔑 Auth Service**: User authentication, 2FA, OAuth providers
- **👤 Profile Service**: User profiles, avatars, preferences
- **👥 Relationships Service**: Friend management, blocking system
- **💬 Chat Service**: Real-time messaging with WebSocket
- **📊 Dashboard Service**: Live activity feeds and statistics
- **🎮 Game Service**: Pong game logic and match management
- **🔔 Notifications Service**: Real-time notifications and alerts

### Infrastructure

- **API Gateway**: Nginx reverse proxy with SSL termination
- **Message Queue**: RabbitMQ for inter-service communication
- **Cache Layer**: Redis for session management and caching
- **Database**: SQLite for each microservice (development)
- **Containerization**: Docker + Docker Compose orchestration

---

## Project Structure

```
ft_transcendence/
├── client/                          # Frontend Application
│   ├── nginx/                       # Nginx reverse proxy config
│   ├── public/                      # Static assets (images, icons)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── auth/               # Authentication forms
│   │   │   ├── chat/               # Chat interface components
│   │   │   ├── game/               # Game UI components
│   │   │   ├── profile/            # Profile management
│   │   │   └── ...
│   │   ├── pages/                   # Route components
│   │   ├── services/                # API communication layer
│   │   ├── handlers/                # Event handlers and form logic
│   │   ├── utils/                   # Utilities and stores
│   │   └── router/                  # SPA routing configuration
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Backend Microservices
│   ├── auth-service/               # Authentication & Authorization
│   ├── profile-service/            # User Profile Management
│   ├── relationships-service/      # Social Features (Friends/Blocking)
│   ├── chat-service/              # Real-time Messaging
│   ├── game-service/              # Game Logic & Match History
│   ├── dashboard-service/         # Live Activity Dashboard
│   ├── notifications-service/     # Push Notifications
│   ├── redis/                     # Redis Configuration
│   └── docs/                      # API Documentation
│
├── docker-compose.yml             # Service orchestration
├── Makefile                       # Development commands
└── README.md
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience commands)

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ft_transcendence
   ```

2. **Configure environment variables**

   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Start all services**

   ```bash
   make up
   # or directly: docker compose up --build -d
   ```

4. **Access the application**
   - **HTTPS**: https://localhost:9090 (recommended)
   - **HTTP**: http://localhost:8080

### Development Commands

```bash
make up      # Start all services
make down    # Stop and clean all services
make re      # Restart all services
make logs    # View all service logs
```

---

## API Services

| Service               | Port      | Description                    |
| --------------------- | --------- | ------------------------------ |
| Auth Service          | Internal  | JWT authentication, 2FA, OAuth |
| Profile Service       | Internal  | User profiles and preferences  |
| Relationships Service | Internal  | Friend management system       |
| Chat Service          | Internal  | WebSocket-based messaging      |
| Game Service          | Internal  | Pong game logic and history    |
| Dashboard Service     | Internal  | Real-time activity feeds       |
| Notifications Service | Internal  | Push notification system       |
| Nginx Gateway         | 8080/9090 | Reverse proxy and static files |

_All backend services communicate internally through the Docker network and RabbitMQ message queue._

---

## Technology Stack

### Frontend

- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js** - Data visualization library

### Backend

- **Node.js** - JavaScript runtime
- **Fastify** - Fast and efficient web framework
- **SQLite** - Lightweight database for each service
- **Redis** - In-memory data structure store
- **RabbitMQ** - Message broker for microservices

### DevOps

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and web server

---

## Development

This project was developed as part of the **42 School curriculum**, focusing on:

- Advanced web development with modern technologies
- Microservices architecture and containerization
- Real-time web applications with WebSockets
- Security best practices and authentication
- Responsive design and user experience

The codebase demonstrates production-ready patterns including proper error handling, input validation, rate limiting, and secure communication between services.
