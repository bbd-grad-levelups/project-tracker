# WELCOME TO PROJECT TRACKER FRONTEND
This is a website that tracks the progress of your jira board and provides you with basic statistics too. It also has the ability to store URLs of the GitHub and Confluence of the relevant project! 

Please proceed to the **Prerequisites** section

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Frontend] You have installed [Node.js](https://nodejs.org/) (which includes npm).
- [Frontend] You have localhost:5173 available for debugging as that is Vite's default for development.
- [Frontend] Ensure the variable **const local** is set to true for local testing.
- [Frontend] You have a *.env* file in ./project-tracker/project-tracker-frontend folder with the following => VITE_BASE_URL: "http://localhost:3000". This points to the local server.

## Installation

To install and run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bbd-grad-levelups/project-tracker.git
   ```
### Frontend Installation

2. From commandline, enter the frontend folder
    ```bash
    cd project-tracker
    cd project-tracker-frontend
    ```

3. Install the prerequeite packages
    ```bash
    npm install
    ```
4. Now run the app in dev mode
    ```bash
    npm run dev
    ```
    This will launch on localhost:5173
    

<!-- Nedd to make .env file that has VITE_BASE_URL: [-insert localhost url here-] -->