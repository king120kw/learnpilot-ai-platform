# VicCalary Mobile Nutrition App

VicCalary is a mobile-first web application designed to help users track their nutrition, transform their health, and manage their food budget. It provides personalized guidance and analysis powered by user-provided data.

This project is currently in local development.

## Features

-   **Multi-Step User Onboarding:** A comprehensive, multi-screen onboarding process to collect detailed user information, including name, age, weight, height, fitness goals, gender, activity level, dietary preferences, and lifestyle habits.
-   **Personalized Health Targets:** At the end of onboarding, the application calculates personalized daily calorie and macronutrient targets based on the user's specific data and goals.
-   **User Authentication:** A secure backend authentication system allows users to sign up for a new account and log in. Sessions are managed using JWTs to ensure data is persistent and secure.
-   **Data Persistence:** All user profile and onboarding data is saved to a local SQLite database via a Python/Flask backend.
-   **Dynamic Dashboard:** The main dashboard is dynamically populated with the user's name and personalized health data fetched from the backend.
-   **Profile Management:** Users can view their profile information and edit their core data (name, age, weight, etc.), with changes saved to the backend.

## Tech Stack

-   **Frontend:**
    -   HTML5
    -   CSS3
    -   Vanilla JavaScript
-   **Backend:**
    -   Python 3.12
    -   Flask
-   **Database:**
    -   SQLite

## How to Run Locally

To run the VicCalary application on your local machine, you will need two terminals running simultaneously.

### Prerequisites

-   Python 3.10+ installed on your system.
-   `pip` (Python package installer).

### 1. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install the necessary Python packages for the backend:

```bash
pip install Flask Flask-Bcrypt PyJWT Flask-Cors
```

### 2. Initialize the Database

Before running the server for the first time, you need to create the SQLite database and its tables. Run the following command from the root directory:

```bash
python backend/db_init.py
```
This will create a `viccalary.db` file inside the `backend` directory. You only need to do this once.

### 3. Run the Application

**Terminal 1: Start the Backend**

```bash
# Navigate to the backend directory
cd backend

# Run the Flask server
python server.py
```
This will start the backend server on `http://127.0.0.1:5000`.

**Terminal 2: Launch the Frontend**

```bash
# Navigate to the frontend directory
cd viccalary-app

# Open the index.html file in your default browser
# On macOS:
open index.html
# On Linux:
xdg-open index.html
# On Windows:
start index.html
```

The application should now open in your browser and be fully functional.

## Project Structure

```
.
├── backend/
│   ├── db_init.py         # Script to initialize the database
│   ├── server.py          # Main Flask server application
│   └── viccalary.db       # SQLite database file (created after init)
└── viccalary-app/
    ├── index.html         # Main HTML file with all app screens
    ├── script.js          # All frontend JavaScript logic
    └── style.css          # All CSS styles
```
