# Vrit Technologies Internship Task B

## Overview
This project implements a dynamic Kanban board application using React, TypeScript, Zustand, TailwindCSS, and the DnD Kit library. The application allows users to manage tasks effectively by utilizing features such as drag-and-drop task reordering and column management. The project demonstrates best practices in code organization, component reusability, and state management.

---

## Live Demo
Access the live demo [here](www.google.com).

---

## Features

1. **Drag-and-Drop Functionality:**
   - Rearrange tasks within a column or move tasks across columns effortlessly using DnD Kit.

2. **State Management:**
   - Powered by Zustand with persistent state handling for tasks and columns.

3. **Reusable Components:**
   - Modular `TaskCard` and `Column` components for scalability and maintainability.

4. **Tailored Utilities:**
   - Utility functions like `generateId` for unique ID generation and `cn` for class name merging.

5. **Modern UI/UX:**
   - A responsive design built with TailwindCSS for an intuitive user experience.

6. **Testing:**
   - Unit tests for key components ensure application reliability.

---

## Folder Structure
```
src/
├── components/        # Reusable UI components
├── store/             # State management logic
├── lib/               # Utility functions
├── types/             # TypeScript definitions
├── App.tsx            # Main application file
└── main.tsx           # Entry point
```
---


## Setup Instructions

### Prerequisites
- **Node.js** (v14 or later)
- **npm** or **yarn**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/alexbytesback/Vrit-Technologies-Frontend-Internship-Task-B
   ```
2. Navigate to the project directory:
   ```bash
   cd Vrit-Technologies-Frontend-Internship-Task-B
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Running Tests
Run unit tests using:
```bash
npm run test
```

---

## Technology Choices and Rationale

1. **React:** Chosen for its component-based architecture and strong ecosystem.
2. **TypeScript:** Ensures type safety and enhances code maintainability.
3. **Zustand:** Lightweight and efficient state management solution.
4. **DnD Kit:** Provides robust and customizable drag-and-drop functionality.
5. **TailwindCSS:** Speeds up development with utility-first CSS classes.
6. **Vite:** Offers fast builds and optimized development experience.

---

## Known Limitations/Trade-offs

1. **No Backend Integration:**
   - The application is front-end focused and lacks server-side data handling.

2. **Limited Test Coverage:**
   - Unit and integration tests have been written for critical components and functions, but full coverage across all edge cases could not be achieved due to time constraints. Expanding the test suite would enhance reliability.

3. **Responsive Design:**
   - While the application is designed to be responsive, certain edge cases (e.g., extreme screen sizes or older browsers) might require additional fine-tuning. Tailoring for these scenarios could be an area of improvement in future iterations.

4. **Performance Optimization:**
   - The application is optimized for general use cases, but certain performance enhancements, such as lazy loading and code-splitting for non-critical assets, could further improve performance in production environments.

---

## Future Improvements

1. **Backend Integration:**
   - Implement a backend service for persistent storage and multi-user support.

2. **Enhanced Testing:**
   - Increase test coverage to include edge cases and integration tests.

3. **Accessibility:**
   - Add ARIA roles and keyboard navigation for improved accessibility.

4. **Real-Time Collaboration:**
   - Enable live updates for multiple users using WebSockets.

---

## Time Spent
Approximately **10 hours and 48 minutes** were spent on planning, development, testing, and documentation.

---

## Assumptions Made
1. **Single-User Context:**
   - The application assumes only one user is interacting with the Kanban board at a time.

2. **Static Data Persistence:**
   - Zustand’s local storage middleware is used to persist data across sessions.

---

## Feedback and Contact
If you have any questions or suggestions regarding the project, feel free to reach out:

**Email**: prashantkoirala465@gmail.com
**GitHub**: [alexbytesback](https://github.com/alexbytesback)

---

Thank you for the opportunity to showcase my skills!

---

## License
This project is licensed under the [MIT License](https://github.com/alexbytesback/Vrit-Technologies-Frontend-Internship-Task-B/blob/main/LICENSE). 


---
