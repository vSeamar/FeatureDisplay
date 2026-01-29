# FeatureDisplay

A test application with multiple pages and interactive features designed for automated agent testing.

## Features

- **Dashboard** - Overview with stats, quick actions, notifications, and modals
- **Todo List** - Full CRUD operations, filtering, sorting, bulk actions, search
- **Notes** - Grid/list views, categories, tabs, search, create/edit/delete
- **Data Table** - Sortable columns, pagination, filtering, bulk operations, CSV export
- **Forms Demo** - Various input types, validation, file upload, tags, accordions
- **Settings** - Tabs, toggles, theme switching, multiple configuration options

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

### Prerequisites

- Node.js (v14 or higher)

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Available Pages

- `/` - Dashboard
- `/todos.html` - Todo List
- `/notes.html` - Notes
- `/data.html` - Data Table
- `/forms.html` - Forms Demo
- `/settings.html` - Settings

## API Endpoints

The application includes a simple REST API:

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a note
- `DELETE /api/notes/:id` - Delete a note

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
