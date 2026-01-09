# Drag and Drop Project

## Description

This project is a drag-and-drop application built using TypeScript. It provides a modular structure for managing projects, including features like adding, updating, and listing projects. The application is styled using SCSS and follows best practices for object-oriented programming.

## Technologies Used

- TypeScript
- SCSS
- HTML
- Node.js (for dependency management)

## Object-Oriented Programming (OOP) Principles

This project is designed with OOP principles to ensure modularity, scalability, and maintainability. Key OOP concepts used include:

- **Encapsulation**: Each component, such as `Project`, `Popup`, and `Login`, encapsulates its own data and behavior.
- **Inheritance**: Common functionality is shared across components using base classes.
- **Polymorphism**: Components can override or extend base functionality to suit specific needs.
- **Abstraction**: Complex logic is hidden behind simple interfaces, making the code easier to use and extend.

## Features

- **Dynamic Project Management**: Add, update, and delete projects dynamically.
- **Popup Management**: Modular popups for user interactions.
- **Form Validation**: Comprehensive validation for project forms.
- **State Management**: Centralized state management for projects using `ProjectState`.
- **Reusable Components**: Components like `Fields` and `Base` are designed for reusability.
- **Utility Functions**: Helper functions for validation and other repetitive tasks.
- **SCSS Variables and Mixins**: Consistent styling using SCSS variables and mixins.

## Project Structure

```
public/
  assets/
    img/          # Images used in the project
src/
  main.ts         # Entry point of the application
  sass/           # SCSS files for styling
    layouts/      # Layout-specific SCSS files
    vars/         # Variables for SCSS
  scripts/
    components/   # Core components like Base, Fields, Login, etc.
    enums/        # Enums used in the project
    store/        # State management files
    types/        # Type definitions
    utils/        # Utility functions
    validation/   # Validation logic for forms
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdallahawad3/drag-drop.git
   ```
2. Navigate to the project directory:
   ```bash
   cd drag-drop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs the linter to check for code quality.
