# Paperclip Clicker Game

A simple online incremental game where players click to create paperclips, developed with Next.js, Tailwind CSS, Prisma, and NextAuth.js.

## Features

- = User accounts with authentication
- =¾ Database storage of game progress
- ¡ Session-based game state management
- <® Clicker game mechanics with upgrades
- <¨ Responsive design with Tailwind CSS
- < Light/dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with demo user
npm run db:seed
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Account

- Email: demo@example.com
- Password: password123

## Game Mechanics

- Click the paperclip button to generate paperclips
- Purchase autoclippers to automatically generate paperclips
- Autoclippers cost increases with each purchase
- Game state is automatically saved every 30 seconds

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: SQLite (for development)

## License

This project is licensed under the MIT License.