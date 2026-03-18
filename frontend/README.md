# Handyman.za Admin Dashboard

A modern React dashboard for the Handyman.za platform - a marketplace connecting 
customers with professional handymen. This admin dashboard provides comprehensive 
management of jobs, handymen, customers, and platform analytics.

## 🛠️ Tech Stack

- **React** 18 - UI library
- **Vite** - Build tool and dev server
- **React Router** 6 - Routing and Navigation
- **Tailwind CSS** 4 - Styling and UI components
- **Axios** - API clients with interceptors
- **Context API** - State management (for auth)


## 📂 Project Structure

```
frontend/
|-- src/
|  |-- api                      # API service layer
|  |  |-- apiClient.js          # Axios instance with interceptors
|  |  |-- authService.js        # Authentication API calls
|  |  |-- jobService.js         # Jobs API calls
|  |-- components/              # Reusable UI components
|  |  |-- Sidebar.jsx           # Dashboard navigation
|  |  |-- Topbar.jsx            # Header with user menu
|  |  |-- StatCard.jsx          # Dashboard stats card
|  |  |-- StatusBadge.jsx       # Job status indicators
|  |  |-- JobsTable.jsx         # Jobs data table
|  |  |-- CreateJobModal.jsx    # Job creation form
|  |  |-- LoadingSpinner.jsx    # Loading states
|  |-- layouts/                 # Layout components
|  |  |-- DashboardLayout.jsx   # Main dashboard layout
|  |-- pages/                   # Page components
|  |  |-- DashboardHome.jsx     # Overview dashboard
|  |  |-- Jobs.jsx              # Jobs management
|  |  |-- Handymen.jsx          # Handyman management
|  |  |-- Customers.jsx         # Customer management
|  |  |-- Login.jsx             # Authentication
|  |  |-- Register.jsx          # User registration
|  |  |-- ...(other pages coming)
|  |-- routes/                  # Routing configuration
|  |  |-- ProtectedRoute.jsx    # Auth guard
|  |-- router/                  # Routing configuration
|  |  |-- AppRouter.jsx         # Main router
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


## 🚀 Features

## ✅ Implemented

- **Complete Admin Dashboard**
    - 📊 Dashboard overview with key metrics
    - 🛠️ Jobs management
    - 👷 Handymen management
    - 👥 Customers management
    - 💳 Payments tracking (coming soon)
    - ⭐ Reports (coming soon)
    - 📈 Reports (coming soon)
    - ⚙️ Settings (coming soon)

- **Authentication & Authorization**
    - User login with JWT authentication
    - User registration with validation
    - Protected routes with redirects
    - Token storage in localStorage
    - Axios interceptors for automatic token attachment
    - 401 handling and token refresh

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

- **In Progress**
    - Handyman management
    - Customer management
    - Payment tracking
    - Reviews moderation
    - Analytics dashboard

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend server running (handyman_za/backend)

1. Clone the repository
    ```bash
    git clone https://github.com/P-Mnguni/handyman_za/frontend.git
    cd frontend
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Environment variables
    Create a '.env' file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Build for production
    ```bash
    npm run build
    ```

6. Open your browser at
    http://localhost:5173

### Available Scripts

- **npm run dev**       - Start development server
- **npm run build**     - Build for production
- **npm run preview**   - Preview production build
- **npm run lint**      - Run ESLint

## 🔌 Backend Integration

This frontend connects to the Handyman.za backend API. Expected endpoints:

### 🔐 Authentication

- `POST /auth/register`         - Create new account
- `POST /auth/login`            - Get JWT tokens
- `POST /auth/refresh-token`    - Refresh access token
- `GET /auth/me`                - Get current user

### 🏢 Jobs

- `GET /jobs`                   - List all jobs
- `GET /jobs/:id`               - Get single job
- `POST /jobs`                  - Create new job
- `PATCH /jobs/:id`             - Update job
- `DELETE /jobs/:id`            - Cancel job
- `POST /jobs/:id/accept`       - Accept job (handyman)
- `POST /jobs/:id/start`        - Start job (handyman)
- `POST /jobs/:id/complete`     - Complete job (handyman)

## 🎯 Key Features Demonstrated

### Professional Error Handling
- Loading states for all async operations
- User-friendly error messages
- Retry mechanisms
- Network error detection

### Modern React Patterns
- Custom hooks for reusable logic
- Context for state management (coming soon)
- Component composition
- Separation of concerns (API layer, components, pages)

### Enterprise-Grade Structure
- Service layer for API calls
- Protected routes with auth guards
- Reusable UI components
- Consistent styling with Tailwing
- Mobile-responsive design

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