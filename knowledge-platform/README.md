# KnowledgeHub – Frontend

Modern React application built using Vite.  
Provides article browsing, dashboard management, AI-assisted writing interface, and JWT-based authentication flow.

-------------------------------------------------------
# Approach
-------------------------------------------------------

## Architecture Overview

The frontend follows a modular component-based architecture:

Pages → Components → API Layer → Context → Backend

### Structure

- **Pages**
  - Route-level views (Home, Dashboard, Login, etc.)

- **Reusable Components**
  - Article cards, Navbar, AI Panel, Rich Text Editor, etc.

- **API Layer**
  - Centralized Axios instance
  - JWT automatically attached using interceptors

- **Auth Context**
  - Manages authentication state globally

- **Protected Route**
  - Restricts access to authenticated users

---

## Folder Structure

src/
├── api/
├── components/
├── context/
├── pages/
├── assets/
├── App.jsx
└── main.jsx

---

##  Key Design Decisions

- Used React Context API for authentication state
- Implemented Axios interceptors for automatic JWT handling
- Built a reusable AI Assist Panel component
- Created ProtectedRoute wrapper for secured routes
- Separated API logic from UI components
- Designed responsive and maintainable UI

Focus areas:
- Clean separation of concerns
- Maintainable component structure
- Smooth user experience
- Stateless authentication flow

-------------------------------------------------------
# AI Usage
-------------------------------------------------------

AI was used as a productivity assistant, primarily for styling suggestions and minor refactoring.

### Tools Used:
- ChatGPT
- GitHub Copilot

### Where AI Helped:

- Generating initial CSS layout suggestions
- Suggesting UI animation improvements
- Refining form validation logic
- Reviewing component structure

### What Was Designed and Verified Manually:

- Routing architecture implemented independently
- Authentication context logic written and tested manually
- Axios interceptor configuration implemented independently
- API integrations tested and verified manually
- Component hierarchy designed manually
- UX flow and feature decisions made independently

AI was mainly used for styling refinement and exploring UI enhancement ideas.  
Core architecture, state management, and API integration logic were implemented and validated independently.


-------------------------------------------------------
# Setup Instructions
-------------------------------------------------------

## Prerequisites

- Node.js 18+
- npm or yarn

---

## Run Frontend

```bash
npm install
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---
