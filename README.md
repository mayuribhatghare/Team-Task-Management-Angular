# Team Task Management - Angular Frontend

This is the **Angular 19** frontend for the **Team Task Management Tool**, built with **Angular Material** for a modern UI.

##  Features

- User authentication with JWT
- Role-based access control (User & Manager)
- Task creation, update, and assignment
- Status & priority filters
- Reports 
- Angular Material

##  Tech Stack

- **Angular 19**
- **Angular Material**
- **TypeScript**
- **RxJS**
- **SCSS**

## Installation

```bash
# Clone the repository
git clone https://github.com/mayuribhatghare/team-task-management-angular

# Navigate into the folder
cd Team-Task-Management-Angular

# Install dependencies
npm install
```

##  Run Locally

```bash
# Development server
ng serve

# Open in browser
http://localhost:4200/
```

##  Environment Setup

Create a file named `environment.ts` inside `src/environments/` with:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5000/api'
};
```

For production, update `environment.prod.ts` accordingly.

##  Folder Structure

```
src/
 ├── app/
 │   ├── components/    # UI components
 │   ├── features/         # Feature pages
 │   ├── services/      # API calls
 │   ├── models/        # Interfaces & types
 │   └── guards/        # Route guards
 ├── assets/            # Static files
 └── environments/      # Environment configs
```

##  Author

**Mayuri Bhatghare**  
.NET & Angular Developer  
mayuri.bhatghare@gmail.com

---

⭐ If you like this project, give it a star on GitHub!
