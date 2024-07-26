### RESIDENCE MANAGEMENT SYSTEM

This documentation provides setup instructions, technical choices, and usage instructions for the Residence Management System Dashboard. The project leverages modern web development technologies to create a dynamic and user-friendly interface for managing university residence data.

### Table of contents

1.Setup Instructions
2.Technical Choices
3.Usage Instructions

### Setup Instructions

Before setting up the project, ensure you have the following installed:

.Node.js
.npm
.json-server
.SASS

## Installation

1. Clone the repository using `git clone jmukamani/residence_management_system.git
   cd residence_management_system

2. Install dependecies
   npm install
   npm install json-server
   npm install sass

3. Start the JSON server:
   json-server --watch db.json --port 3000

4.Compile SASS to CSS:
sass scss/main.scss css/style.css

5.Open the project:
Open index.html in a web browser.

### Technical Choices

The project uses the following technologies:

1. HTML5: For structuring the content.
2. CSS3 and SASS: For styling and maintaining stylesheets efficiently.
3. Bootstrap: To streamline development with pre-built responsive components.
4. JavaScript: For interactive functionalities.
5. jQuery: For simplified DOM manipulation and Ajax requests.
6. Font Awesome: For scalable vector icons.
7. JSON Server: To simulate a REST API for managing data.

### Rationale Behind the choices

-Bootstrap: Chosen for its responsive grid system and ready-to-use components, which accelerate the development process.
-SASS: Enables more organized and maintainable CSS with features like variables, mixins, and nested rules.
-jQuery: Simplifies tasks such as DOM manipulation and Ajax calls, making the code more concise and easier to write.
-JSON Server: Provides a quick and easy way to create a mock REST API, facilitating local development without the need for a full backend setup.

### Usage Instructions

## Dashboard Functionalities

# Navigation: Use the navigation bar at the top to switch between different sections such as Home, Admin, and Student.

# Home Page:

Displays a welcome message and a brief description of the residence options.
A call-to-action button to book a room.
Admin Dashboard:

-Room Management: View, add, edit, and delete rooms. Rooms can be filtered by various criteria.
-Maintenance Requests: View and manage maintenance requests. Requests can be filtered by room, status, and notes can be added.
-Alerts and Notifications: Display important alerts such as upcoming inspections, maintenance deadlines, and urgent requests.
-Theme Switcher: Toggle between light and dark themes. The theme preference is saved in local storage.

Example Actions

Navigate to the Maintenance Requests section.
Use the filter options to find specific requests.
Update the status or add notes as needed.
Switching Themes:

Toggle the theme switcher located in the Admin dashboard.
The theme will switch between light and dark modes, with the preference saved for future visits.
