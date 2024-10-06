# Donation Management System - SAHEM

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Donation Offer and Request Management](#donation-offer-and-request-management)
  - [Notification System](#notification-system)
  - [User Management](#user-management)
  - [Advanced Design Patterns](#advanced-design-patterns)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Demo](#demo)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The Donation Management System is a full-stack application designed to streamline the donation process between donors and beneficiaries. The platform enables donors to create offers for various donation types and beneficiaries to submit requests for assistance, matching donations with requests based on specific criteria such as type and location.

## Features

### Authentication and Authorization
- **Secure Registration and Login**: New users can register, confirm their emails, and log in securely.
- **JWT-Based Authentication**: Sessions are authenticated using JSON Web Tokens (JWT), providing secure access to the system.
- **Role-Based Access Control**: Permissions are granted based on user roles, with specific access levels for Donors, Beneficiaries, and Admins.

### Donation Offer and Request Management
- **Create Offers and Requests**: Donors can create offers for donation items, and beneficiaries can request items they need.
- **Donation Fulfillment**: Donors can fulfill a request by providing part or all of the requested quantity, with updates to the request’s status and the donor’s donation history.
- **Donation Take Request**: Beneficiaries can take a request, with updates to the offer’s status and the beneficiary’s donation history.
- **Request-Offer Matching**: Requests and offers are automatically matched based on donation type and location, enabling an efficient connection between donors and beneficiaries.

### Notification System
- **Custom Notifications**: Real-time notifications for matched offers and requests, and for updates on donation statuses.
- **Mark Notifications as Read**: Users can mark notifications as read or delete them based on personal preferences.

### User Management
- **Role-Based Registration**: User registration supports multiple roles, including Donor, Beneficiary, and Admin.
- **Account Management**: Users can update their profiles, manage offers and requests, and view their history of donations or received items.

### Advanced Design Patterns
- **Singleton Pattern**: Ensures a single instance of the database connection throughout the application, promoting efficient resource management.
- **Observer Pattern**: Enables a real-time notification system, where users are automatically updated about relevant events.
## System Architecture
The system follows a **RESTful architecture** with a **Model-View-Controller (MVC)** structure, separating concerns across:
- **Models** for data and relationships (e.g., Donor, Beneficiary, DonationOffer, DonationRequest, Notification).
- **Controllers** for business logic handling user interactions and data processing.
- **Routes** that handle HTTP requests for user operations, donation management, and notifications.

The backend is responsible for handling authentication, database operations, and API requests, while the frontend provides an interactive interface for the users.

## Technology Stack

**Backend:**
- Node.js & Express - For server-side and API management
- MongoDB - As the database to store and manage donation data
- JWT - For secure user authentication
- Bearer Key - Used for secure API access and authentication

**Frontend:**
- React - For building user interfaces

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ibrahim97zak/ShareCare-Group-C.git
   cd ShareCare-Group-C
2. **Install dependencies for both frontend and backend:**
   ```bash
   npm install              # For backend dependencies
   cd client && npm install # For frontend dependencies
3. **Set environment variables in a .env file:**
   ```bash
   PORT=5000
   MONGO_URI=your_mongo_database_uri
   WT_SECRET=your_jwt_secret
   BEARERKEY=your_bearerkey
   EMAIL=your_email
   EMAIL_PASSWORD=your_email_password
4. **Run the application:**
  - Backend: From the root folder, run:
     ```plaintext
     npm start
     ```
  - Frontend: From the client folder, run:
     ```plaintext
     npm start
     ```

5. **Access the application** at `http://localhost:5000.`
## Demo
Check out the demo of the Donation Management System below:

## Usage
### For Donors:
  - Register: Create an account and confirm your email.
  - Create Offers: Log in to create new donation offers.
  - View Requests: Check requests made by beneficiaries and fulfill them as needed.
### For Beneficiaries:
  - Register: Create an account and confirm your email.
  - Submit Requests: Log in to submit requests for items you need.
  - Take Offers: View available donation offers and take those that match your needs.
### For Admins:
  - Manage Users: Admins can monitor user registrations, access user data, and delete user accounts or any associated information as needed.
  - Monitor Donations: Keep track of all offers and requests within the system by charts.
## API Endpoints
- **Authentication:** `/api/auth`
  - POST `/register` - Register a new user
  - POST `/login` - Log in a user
  - POST `/confirm-email` - Confirm user email
  - POST `/logout` - Log out a user session
- **Donation Management:** `/api/donations`
  - **Donation Offer:**
    - POST `/offer` - Create a new donation offer
    - PUT `/offer/:id` - Update a donation offer by id 
    - POST `/take-offer` - Beneficiary takes a donation offer
    - GET `/:userId/offers` - Get a donation offers by user id
    - GET `/offers` - Get all donation offers
  - **Donation Request:**
    - POST `/request` - Create a new donation request
    - PUT `/request/:id` - Update a donation request by id 
    - POST `/fulfill-request` - Donor fulfill a donation request
    - GET `/:userId/requests` - Get a donation requests by user id
    - GET `/requests` - Get all donation requests
  
  - GET `/:id` - Get a donation by it's id
  - GET `/` - Get all donations
  - GET `/:userId/donations` - Get all donations by user id
  - GET `/:userId/received-donations` - Get received donations by beneficiary id
  - GET `/:userId/sent-donations` - Get sent donations by donor id
  - DELETE `/:id` - Delete donation by it's id
  - POST `/:id` - Match a donation request with a donation ffer

- **Notification Management:** `/api/notifications`
  - GET `/userId` - Get user notifications
  - POST `/:notificationId/read` - Mark notification as read
  
- **User Management:** /api/users
  - GET `/:Id` - Get user by id
  - GET `/` - Get all users
  - PUT `/:Id` - Update user by id
  - DELETE `/:Id` - Delete user by id
  
## Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License
This project is licensed under the MIT License.
