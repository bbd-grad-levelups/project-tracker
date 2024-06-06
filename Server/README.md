# WELCOME TO PROJECT TRACKER BACKEND
This is the API for the project tracker website.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Backend] You have installed [Node.js](https://nodejs.org/) (which includes npm).
- [Backend] You have localhost:3000 available for dev work.
- [Backend] You have added the .env file in ./project-tracker/project-tracker-frontend folder with the following => VITE_BASE_URL: http://localhost:3000

## Environment Variables

The system uses a few environment variables, that you will have to add to your windows env variables.

- projecttracker_db_endpoint: endpoint for your local database instance.
- projecttracker_db_user: user for your local database instance.
- projecttracker_db_password: password for you local database instance.
- projecttracker_userpool_id: Userpool id for Cognito.
- projecttracker_client_id: Client id for Cognito.

The Cognito details can't be replicated locally. Ask Johan V for access to those.

## Database

Create a local SQL Server database :shrug:

Local database should have a db "ProjectTrackerDB". Run the two scripts in the "SQL" Folder to get it up to date and ready to work with.

## Installation

To install and run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bbd-grad-levelups/project-tracker.git
   ```
### Backend Running

2. From commandline, enter the backend folder
    ```bash
    cd Server
    ```

3. Install the prerequeite packages
    ```bash
    npm install
    ```
4. Now run the app
    ```bash
    npm start
    ```
    This will launch on localhost:3000 