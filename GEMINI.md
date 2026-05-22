# ASys (Class Attendance System) - Gemini Context

This project is a real-time Class Attendance System built with **Next.js**, **Convex**, and **Tailwind CSS**. It features a robust authentication system and a role-based access control model.

## Project Overview

- **Frontend:** Next.js 15+ (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS 4, Radix UI (base-ui), Hugeicons.
- **Backend:** Convex (Real-time database, serverless functions).
- **Authentication:** Convex Auth (Username/Password provider).
- **Forms & Validation:** React Hook Form, Zod.
- **UI Components:** custom shadcn/ui-inspired components located in `components/ui/`.

## Architecture & Data Model

### Backend (Convex)
Located in the `convex/` directory:
- `schema.ts`: Defines the database structure.
    - `users`: Extended auth table storing `username`.
    - `profiles`: Linked to `users`, stores `firstName`, `lastName`, `telephone`, `role`, and `classes`.
    - `logs`: Audit logs for system actions.
- `auth.ts`: Configuration for Convex Auth.
- `fx/`: Contains backend business logic (mutations and queries).
    - `profile.ts`: Profile creation and updates.
    - `users.ts`: Fetching current user data.
    - `usernames.ts`: Username availability checks.

### Frontend Structure
- `app/`: Next.js routes and layouts.
    - `(dashboard)/`: Main application dashboard.
    - `onboarding/`: User profile setup flow.
    - `signin/`: Authentication pages.
- `features/`: Encapsulated feature logic (e.g., `onboarding-form.tsx`, `sign-in-form.tsx`).
- `components/`:
    - `global/`: App-wide components like the logo.
    - `ui/`: Reusable primitive components (buttons, inputs, cards, etc.).
- `lib/`: Shared utilities (`utils.ts`) and constants (`constants.ts`).
- `providers/`: React context providers (Convex, Auth, Themes).

## Development Lifecycle

### Prerequisites
- Node.js and pnpm (preferred).
- Convex account and project setup.

### Key Commands
- `pnpm dev`: Starts the Next.js development server.
- `pnpm convex-dev`: Starts the Convex development functions and schema sync.
- `pnpm build`: Builds the production application.
- `pnpm lint`: Runs ESLint for code quality checks.

### Coding Conventions
- **TypeScript:** Strict type safety is encouraged. Use `_generated/api` and `_generated/dataModel` for backend interactions.
- **Styling:** Use Tailwind CSS 4 utility classes. Prefer the `cn()` utility for conditional class merging.
- **State Management:** Use Convex hooks (`useQuery`, `useMutation`) for server state.
- **Validation:** Always use Zod schemas for form validation and backend argument validation.

## Roles and Permissions
Defined in `lib/constants.ts`:
- `ADMIN`: Full system access.
- `LEADER`, `MENTOR`, `SHEPHERD`: Intermediate administrative/management roles.
- `STUDENT`: Standard user role.

## Important Notes
- **AI Guidelines:** Always read `convex/_generated/ai/guidelines.md` when working on backend code for important Convex-specific rules.
- The `predev` script runs `convex init` and a custom `setup.mjs` script.
- The project uses `Geist` and `Instrument Sans` fonts.
- Toast notifications are handled by `sonner`.
