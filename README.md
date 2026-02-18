# Chennai Blueprint Showcase

A modern architectural floor plan showcase and design tool built with a full-stack TypeScript setup.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)

## 🏗️ Features

### ✅ Completed Features
- **Interactive Floor Plan Viewer** - Zoom, pan, and explore floor plans
- **Cost Estimator** - Detailed construction cost breakdowns
- **Floor Plan Upload** - Upload and manage your floor plans
- **Vector Floor Plan Editor** - Drag-to-resize interactive editing
- **AI-Assisted Editor** - Select areas and get AI-powered architectural suggestions
- **Authentication** - OAuth integration with session management
- **Developer Tools** - Manus debug collector for browser logs and session replay

### 🚧 In Progress
- Export modified floor plans

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool with HMR
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Component library

### Backend
- **Express** - Web server
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database ORM
- **MySQL** - Database

### AI Integration
- **Google Gemini 2.5 Flash** - LLM for architectural suggestions
- **Image Generation** - AI-powered design visualization

## 🎨 Design Philosophy

Bauhaus Modernism meets Indian Contemporary aesthetic:
- Deep charcoal backgrounds
- Saffron accents
- Blueprint-inspired geometric layouts
- 2BHK house design showcase

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/chennai-blueprint-showcase.git
cd chennai-blueprint-showcase
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations
```bash
pnpm db:push
```

5. Start development server
```bash
pnpm dev
```

The application will be available at `http://localhost:5000`

## 📦 Project Structure

```
chennai-blueprint-showcase/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and helpers
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── db/              # Database schema and migrations
│   └── index.ts         # Server entry point
├── shared/              # Shared types and utilities
└── public/              # Static assets
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Jothi.J**

## 🙏 Acknowledgments

- Inspired by modern architectural design tools
- Built with love for the Chennai architecture community

