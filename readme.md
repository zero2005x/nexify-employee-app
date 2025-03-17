# Nexify Employee App Documentation

## Overview

Nexify Employee App is a React-based web application for managing employee records. The application allows users to view, add, and save employee information through a clean, responsive interface styled with Tailwind CSS.

## Table of Contents

- Features
- Tech Stack
- Getting Started
- Project Structure
- Component Breakdown
- API Integration
- Styling
- Future Enhancements

## Features

- **View Employees:** Display all employee records in a table format
- **Add Employees:** Add new employee records with form validation
- **Update Data:** Refresh employee data from the server
- **Form Validation:** Validate input fields for required data and appropriate formats
- **Responsive UI:** Clean interface that works across device sizes

## Tech Stack

- **React:** Front-end library for building the user interface
- **Tailwind CSS:** Utility-first CSS framework for styling
- **PropTypes:** Type checking for React props
- **Fetch API:** For making HTTP requests to the backend server

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/nexify-employee-app.git
cd nexify-employee-app
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the project root (if needed for configuration)

```
SKIP_PREFLIGHT_CHECK=true
```

4. Start the development server

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
nexify-employee-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js           # Main application component
│   ├── App.css          # Tailwind CSS imports and custom styles
│   ├── api.js           # API service functions
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration for Tailwind
```

## Component Breakdown

### App.js

The main component that orchestrates the entire application:

- Manages application state (employees, form data, UI states)
- Handles API calls through the service functions
- Contains the main UI layout and subcomponents

### EmployeeRow

Displays a single employee record in the table:

- Shows name, date of birth, salary, and address
- Displays salary as both a range input and numeric value

### AddEmployeeRow

Provides input fields for adding a new employee:

- Input validation with error messages
- Interactive range slider for salary

## API Integration

The application interacts with a RESTful API through the following endpoints:

### Fetch Employees

```javascript
GET http://nexifytw.mynetgear.com:45000/api/Record/GetRecords
Response: { Success: true, Msg: "", Data: [{...}, {...}] }
```

### Save Employee

```javascript
POST http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords
Payload: [{Name:"Test1", DateOfBirth:"1995-1-1", Salary:54321, Address:"Test Address1"}, ...]
Response: { Success: true, Msg: null, Data: null }
```

## Styling

The application uses Tailwind CSS for styling with custom component classes defined in `App.css`:

```css
@layer components {
  .btn-base {
    @apply px-5 py-2.5 mr-2.5 cursor-pointer border-0 rounded;
  }
  .btn-add {
    @apply btn-base bg-blue-500 text-white hover:bg-blue-600;
  }
  .btn-save {
    @apply btn-base bg-green-500 text-white hover:bg-green-600;
  }
  .btn-update {
    @apply btn-base bg-red-500 text-white hover:bg-red-600;
  }
}
```

## User Flow

1. **Initial Screen**: The application loads and displays existing employee data (if any)
2. **Update Data**: Users can click "Update" to refresh the employee list from the server
3. **Add Employee**:
   - Click "Add" to show the input row
   - Fill in employee details (all fields except salary are required)
   - Click "Save" to submit the new employee
4. **Validation**: Form validation ensures all required fields are completed correctly

## Future Enhancements

Potential improvements for future versions:

- Employee record editing functionality
- Employee record deletion
- Search and filtering capabilities
- Pagination for large datasets
- User authentication and permissions
- Responsive design improvements for mobile
- Unit and integration tests
