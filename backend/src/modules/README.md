# API Modules Structure

This directory contains all feature modules for the Handyman.za API

## Structure

src/modules/
|-- index.js        # Route aggregator (this file)
|-- auth/           # Authentication module
| |-- routes.js
| |-- controller.js
| |-- service.js
| |-- validation.js
|-- users/          # User management
|-- handymen/       # Handyman profiles
|-- jobs/           # Job management
|-- services/       # Service catalog
|-- payments/       # Payment processing
|-- reviews/        # Reviews & ratings
|-- notifications/  # Notifications
|-- admin/          # Admin endpoints

## How to Add a New Module

1. Create module directory: `mkdir src/modules/module-name`
2. Create module files (routes, controller, service, validation)
3. Import and mount in `src/modules/index.js`:
    ...javascript
    import moduleRouter from '.module-name/routes.js';
    router.use('/module-path', moduleRouter);