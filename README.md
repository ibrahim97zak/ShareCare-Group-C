# ShareCare Group C

This project is a full-stack application built with React for the frontend and Node.js with Express for the backend.

## Deployment on Render

### Frontend Deployment
1. Ensure that the `vite.config.js` file is configured correctly for production.
2. Build the frontend by running:
   ```bash
   npm run build
   ```
3. Deploy the contents of the `dist` directory to Render.

### Backend Deployment
1. Ensure that all environment variables are set in the Render dashboard.
2. Start the backend server by running:
   ```bash
   npm start
   ```
3. Ensure that the backend is configured to connect to the database and any other services.

### Environment Variables
- Make sure to set the following environment variables in Render:
  - `PORT`: The port on which the server will run (default is 5000).
  - Any other necessary variables for database connections or API keys.

## Running the Application Locally
1. Clone the repository.
2. Navigate to the `FrontEnd` directory and install dependencies:
   ```bash
   npm install
   ```
3. Navigate to the `BackEnd` directory and install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
5. Start the frontend development server:
   ```bash
   npm run start
   ```

## Testing
Run tests for the frontend and backend as needed.
