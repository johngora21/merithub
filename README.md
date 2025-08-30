# Merit - Your Professional Growth Platform

Merit is a comprehensive platform designed to accelerate your professional growth by providing access to jobs, opportunities, tenders, and courses all in one place.

## Features

### Core Modules
- **Jobs** - Discover employment opportunities across various industries and job types
- **Opportunities** - Find scholarships, fellowships, grants, competitions, and volunteer programs  
- **Tenders** - Explore procurement opportunities and business contracts
- **Courses** - Access curated learning resources for skill development

### Integrated Career Guidance
Throughout the platform, you'll find integrated career guidance features including:
- CV review and optimization
- Interview preparation
- Skill gap analysis
- Career path planning
- Study abroad consultancy
- Business mentorship
- Market insights and trends

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd merit-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
merit-platform/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Sidebar.jsx         # Desktop navigation sidebar
│   │   ├── Header.jsx          # Top header component
│   │   └── BottomNavbar.jsx    # Mobile bottom navigation
│   ├── pages/
│   │   ├── Dashboard.jsx       # Overview dashboard
│   │   ├── Jobs.jsx           # Jobs listing page
│   │   ├── Opportunities.jsx   # Opportunities page
│   │   ├── Tenders.jsx        # Tenders page
│   │   └── Courses.jsx        # Courses page
│   ├── App.jsx                # Main app component
│   └── main.jsx               # App entry point
├── public/
├── package.json
└── README.md
```

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
