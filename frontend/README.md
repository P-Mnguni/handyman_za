# Handyman.za Admin Dashboard

A modern, production-ready admin dashboard for the Handyman.za platform. 
Built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Complete Admin Dashboard**
    - 📊 Dashboard overview with key metrics
    - 🛠️ Jobs management
    - 👷 Handymen management
    - 👥 Customers management
    - 💳 Payments tracking (coming soon)
    - ⭐ Reports (coming soon)
    - 📈 Reports (coming soon)
    - ⚙️ Settings (coming soon)

- **Authentication Ready**
    - Login/Register pages (placeholders ready)
    - Protected routes structure
    - Role-based access (Admin focus)

- **Modern UI/UX**
    - Responsive design (mobile, tablet, desktop)
    - Collapsible sidebar with smooth animations
    - Dynamic page titles
    - Tailwind CSS for styling
    - Clean, professional interface

- **Developer Experience**
    - Vite for fast development
    - Hot Module Replacement (HMR)
    - React Router for navigation
    - Component-based architecture
    - ESLint ready

## 📂 Project Structure

```
frontend/
|-- src/
|  |-- components/              # Reusable UI components
|  |  |-- Sidebar.jsx           # Navigation sidebar
|  |  |-- Topbar.jsx            # Top navigation bar
|  |  |-- StatCard.jsx          # Statistics card
|  |-- layouts/                 # Layout components
|  |  |-- DashboardLayout.jsx
|  |-- pages/                   # Page components
|  |  |-- DashboardHome.jsx
|  |  |-- Jobs.jsx
|  |  |-- Handymen.jsx
|  |  |-- Customers.jsx
|  |  |-- (more coming)
|  |-- router/                  # Routing configuration
|  |  |-- AppRouter.jsx
|  |-- App.jsx                  # (legacy, will be removed)
|  |-- main.jsx                 # Entry point
|-- public/                     # Static assets
|-- index.html                  # HTML template
|-- package.json                # Dependencies
|-- tailwind.config.js          # Tailwind configuration
|-- postcss.config.js           # PostCSS configuration
|-- .gitignore                  # Git ignore rules
|-- README.md                   
```

## 🛠️ Tech Stack

- **React** 18 - UI library
- **Vite** - Build tool and dev server
- **React Router** 6 - Navigation
- **Tailwind CSS** 4 - Styling
- **Axios** - API calls (ready to use)

## 🚦 Getting Started

### Prerequisites

1. Clone the repository
    ```bash
    git clone <P-Mnguni/Handyman.za>
    cd frontend
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser at
    http://localhost:5173

### Available Scripts

- **npm run dev**       - Start development server
- **npm run build**     - Build for production
- **npm run preview**   - Preview production build
- **npm run lint**      - Run ESLint

## 🔌 Backend Integration

This dashboard is designed to work with the Handyman.za backend API:

- **Base URL**:
    http://localhost:5000/api/v1
- **Authentication**: JWT tokens
- **Endpoints**:
    - POST /auth/login      - User login
    - POST /auth/register   - User registration
    - GET /jobs             - List jobs
    - GET /users            - List users (admin)
    - (More endpoints coming)

## 👥 User Roles

The dashboard currently focuses on Admin functionality:

- View all jobs across platform
- Manage all handymen
- Manage all customers
- Platform analytics and reports
- System settings

## 🤝 Contributing

1. Create a feature branch (
    git checkout -b feature/amazing-feature
)

2. Commit your changes (
    git commit -m 'Add some amazing feature'
)

3. Push to the branch (
    git push origin feature/amazing-feature
)

4. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Built with React + Vite for optimal performance
- Styled with Tailwind CSS for rapid UI development
- Architecture inspired by modern SaaS applications