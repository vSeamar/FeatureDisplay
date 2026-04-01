# TaskFlow

A comprehensive project management SaaS application built to test [Breeze](https://github.com/rvayner/code-ad-creator) — an AI-powered feature launch video generator. TaskFlow spans multiple complexity levels with 26 pages and 66 source files, covering every common SaaS pattern from simple marketing pages to complex interactive features.

## Test Credentials

```
Email: demo@taskflow.com
Password: password123
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI primitives
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js (Credentials provider)
- **Charts:** Recharts
- **Drag & Drop:** @hello-pangea/dnd
- **State:** Zustand
- **Icons:** Lucide React

## All Pages & Features

### Public Pages (Level 1 — Simple)
| Route | Feature |
|-------|---------|
| `/` | Landing page — hero, features grid, testimonials, CTA |
| `/pricing` | 4-tier pricing with monthly/annual toggle |
| `/about` | Team, mission, values |
| `/login` | Email/password authentication |
| `/signup` | Registration with auto-login |

### Core Dashboard (Level 2 — Medium)
| Route | Feature |
|-------|---------|
| `/dashboard` | Stats cards, activity feed, upcoming deadlines, quick actions |
| `/notifications` | Filterable notification center (All/Unread/Mentions) |
| `/team` | Member management, roles, status, invite dialog |
| `/settings` | General, appearance, notifications, security tabs |
| `/settings/profile` | Avatar, bio, danger zone |
| `/settings/integrations` | GitHub, Slack, Jira, Figma, Google Drive, Notion cards |

### Project Management (Level 3 — Complex)
| Route | Feature |
|-------|---------|
| `/projects` | Grid/list views, search, color-coded project cards |
| `/projects/[id]` | **Kanban board** with drag-and-drop, task detail dialogs, list view, timeline view |
| `/tasks` | Cross-project task list with status/priority filters |

### Advanced Features (Level 4 — Very Complex)
| Route | Feature |
|-------|---------|
| `/analytics` | Line/bar/pie charts, date ranges, team performance |
| `/calendar` | Month grid, event creation, day detail panel |
| `/documents` | Folder tree, document list, inline markdown editor |
| `/ai-assistant` | Chat interface with conversation history, simulated AI responses |

### Startup SaaS Features (Newly Added)
| Route | Feature |
|-------|---------|
| `/onboarding` | 4-step welcome wizard (workspace, invite team, first project, success) |
| `/billing` | Subscription management, usage meters, payment methods, invoice history |
| `/changelog` | Release notes timeline with version badges |
| `/status` | System health dashboard, uptime bars, incident history |
| `/help` | FAQ accordion, contact form, quick links |
| `/activity` | Audit log timeline with filters (user, action type, date range) |
| `/settings/api-keys` | Generate/revoke API keys, usage tracking, permissions |
| `/settings/webhooks` | Webhook configuration, event selection, delivery logs, test payloads |

### Global UX Features
| Feature | Description |
|---------|-------------|
| **Command Palette** | `Ctrl+K` / `Cmd+K` — search pages and actions |
| **Keyboard Shortcuts** | Press `?` to see all shortcuts |
| **Toast Notifications** | Success/error/info toasts on actions |
| **Dark Mode** | Theme toggle in header |
| **Collapsible Sidebar** | Organized into Main, Team, Workspace sections |

## Getting Started

```bash
npm run setup   # Install deps, generate Prisma, push DB, seed data
npm run dev     # Start at http://localhost:3000
```

Or manually:

```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## Environment Variables

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── pricing/                    # Pricing page
│   ├── about/                      # About page
│   ├── login/                      # Login page
│   ├── signup/                     # Signup page
│   ├── (dashboard)/                # Authenticated layout group
│   │   ├── layout.tsx              # Sidebar + header + command palette
│   │   ├── dashboard/              # Dashboard overview
│   │   ├── projects/               # Projects + Kanban
│   │   ├── tasks/                  # Task management
│   │   ├── calendar/               # Calendar view
│   │   ├── documents/              # Document editor
│   │   ├── analytics/              # Analytics charts
│   │   ├── ai-assistant/           # AI chat
│   │   ├── team/                   # Team management
│   │   ├── notifications/          # Notification center
│   │   ├── activity/               # Audit log
│   │   ├── billing/                # Subscription management
│   │   ├── changelog/              # Release notes
│   │   ├── status/                 # System status
│   │   ├── help/                   # Help center
│   │   ├── onboarding/             # Welcome wizard
│   │   └── settings/               # Settings + API keys + Webhooks
│   └── api/                        # 11 API route files
├── components/
│   ├── ui/                         # 17 reusable UI primitives
│   ├── layout/                     # Sidebar, Header
│   ├── command-palette.tsx         # Ctrl+K search
│   └── providers.tsx               # Auth + Theme + Toaster
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # Prisma client
│   ├── store.ts                    # Zustand state
│   └── utils.ts                    # Utility functions
└── prisma/
    ├── schema.prisma               # 11 data models
    └── seed.ts                     # 200+ seeded records
```

## Key Patterns for Breeze Testing

- **Authentication flow** — Login/signup with test credentials
- **Multi-step wizard** — Onboarding with 4 steps
- **Command palette** — Ctrl+K global search
- **Drag-and-drop** — Kanban board with column moves
- **Data visualization** — Line, bar, and pie charts
- **Chat interface** — AI assistant with simulated responses
- **CRUD operations** — Tasks, projects, documents, API keys, webhooks
- **Subscription management** — Plans, invoices, payment methods
- **Developer tools** — API keys, webhooks, audit log
- **System pages** — Status, changelog, help center
- **Complex navigation** — Sidebar with 16+ pages, nested routes
- **Dark mode** — Full theme toggle
- **Toast notifications** — Action feedback
- **Keyboard shortcuts** — Global and contextual
