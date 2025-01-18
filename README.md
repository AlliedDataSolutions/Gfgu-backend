# Gfgu - Growing from the ground up

A multivendor app. This is the backend repo

## Installation

### Requirement
* Node
* Virtual studio code

### Run app

Make sure to have docker running on you computer, then follow the code below

```javascript
// Build docker image. Don't forget the period
docker build -t gfgu-app .

// check if gfgu image works
docker images

// Starts or restarts your services
docker compose up

```

server should be running on: 
http://localhost:13000/

## Project structure
Project is feature-base structured. Here is an example 

```javascript
project-root/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authController.js
│   │   │   ├── authRoutes.js
│   │   │   ├── authService.js
│   │   │   ├── authMiddleware.js
│   │   │   ├── authModel.js
│   │   │   └── index.js       # Central export(optional)
│   │   ├── user/
│   │   │   ├── userController.js
│   │   │   ├── userRoutes.js
│   │   │   ├── userService.js
│   │   │   ├── userMiddleware.js
│   │   │   ├── userModel.js
│   │   │   └── index.js
│   │   ├── product/
│   │   │   ├── productController.js
│   │   │   ├── productRoutes.js
│   │   │   ├── productService.js
│   │   │   ├── productModel.js
│   │   │   └── index.js
│   ├── config/          # Configuration files(eg., DB connection, app settings)
│   │   ├── db.js
│   │   ├── appConfig.js
│   │   └── index.js
│   ├── middlewares/          # Global middlewares
│   │   ├── errorMiddleware.js
│   │   ├── validateToken.js
│   │   └── loggerMiddleware.js
│   ├── utils/                # Utility functions (e.g., helpers, formatters)
│   │   └── jwtHelper.js
│   ├── app.js                # Main app setup
│   └── server.js             # Entry point for the application
├── tests/                    # Test files (unit tests, integration tests)
│   ├── auth/
│   │   └── auth.test.js
│   ├── user/
│   │   └── user.test.js
│   └── product/
│       └── product.test.js
├── .env                      # Environment variables
├── .gitignore                # Files to ignore in Git
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Documentation

```

### Foolder Breakdown

Each feature gets its own folder, containing everything it needs to function:

* Controller: Handles requests and responses for the feature.
* Routes: Defines routes/endpoints for the feature.
* Service: Contains the business logic.
* Model: Defines database schema for the feature.
* Middleware: Feature-specific middleware.