# FeatureDisplay

A test application with multiple pages and interactive features designed for automated agent testing.

**Live demo:** [https://carlo.github.io/FeatureDisplay/](https://carlo.github.io/FeatureDisplay/) *(update with your GitHub username)*

## Features

- **Dashboard** - Overview with stats, quick actions, notifications, and modals
- **Todo List** - Full CRUD operations, filtering, sorting, bulk actions, search
- **Notes** - Grid/list views, categories, tabs, search, create/edit/delete
- **Data Table** - Sortable columns, pagination, filtering, bulk operations, CSV export
- **Forms Demo** - Various input types, validation, file upload, tags, accordions
- **Settings** - Tabs, toggles, theme switching, multiple configuration options

## Data Storage

All data (todos, notes, settings) is stored in your browser's `localStorage`. No server or database is required. Data persists across page reloads but is local to your browser.

## Interactive Elements

The application includes many interactive elements for agent testing:
- Buttons (primary, secondary, success, danger, warning, info, outline)
- Forms (text, email, password, number, phone, textarea)
- Dropdowns and multi-selects
- Checkboxes and radio buttons
- Toggle switches
- Date/time pickers
- Color picker
- Range slider
- Star rating
- File upload with drag & drop
- Tags input
- Tables with sorting and pagination
- Modals and overlays
- Tabs and accordions
- Toast notifications
- Search and filtering
- Dark/light theme toggle

## Getting Started

### Static (GitHub Pages)

The app runs entirely in the browser. Open `public/index.html` directly or deploy to any static hosting.

### Local Development with Server (optional)

```bash
npm install
npm start
```

The Express server at `http://localhost:3005` serves the same static files and also provides REST API endpoints. The client-side app uses `localStorage` and does not require the server.

### Available Pages

- `index.html` - Dashboard
- `todos.html` - Todo List
- `notes.html` - Notes
- `data.html` - Data Table
- `forms.html` - Forms Demo
- `settings.html` - Settings

## Deployment

Push to `main` and GitHub Actions will automatically deploy the `public/` folder to GitHub Pages. Make sure GitHub Pages is enabled in your repository settings (Settings > Pages > Source: GitHub Actions).
