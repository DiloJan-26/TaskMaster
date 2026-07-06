# Phase 0 Baseline Audit

Date: 2026-07-06

Scope: Baseline re-onboarding and safety audit only. This document summarizes the current TaskMaster product, architecture, data model, feature inventory, health checks, known risks, and recommended next steps. No production logic was changed during this phase.

## 1. Product Summary

TaskMaster is a full-stack project management platform. It lets users create workspaces, invite team members, manage projects, assign and update tasks, collaborate through comments, track progress, and view dashboard analytics.

The main user journey currently supported by the code is:

1. A user signs up with name, email, and password.
2. The backend creates a user account, stores a hashed password, generates an email verification token, and sends a verification email through SendGrid.
3. The user verifies the email address, then logs in.
4. The frontend stores the returned JWT token and user profile in browser localStorage.
5. The user creates or joins a workspace.
6. Inside a workspace, the user creates projects and assigns project members.
7. Inside a project, the user creates tasks, assigns users, sets status/priority/due date, adds subtasks, adds comments, watches/unwatches tasks, and archives/unarchives tasks.
8. The dashboard shows workspace-level metrics such as project counts, task counts, task status distribution, priority distribution, productivity by project, recent projects, and upcoming tasks.

Main business entities:

- User: An authenticated account with name, email, password hash, profile picture, email verification state, and login metadata.
- Workspace: A team or organization container. It has an owner, members with roles, projects, color, and description.
- Project: A work initiative inside a workspace. It has status, dates, tags, members, tasks, and archive state.
- Task: A work item inside a project. It has status, priority, assignees, watchers, due date, subtasks, comments, attachments metadata, creator, and archive state.
- Comment: A message attached to a task. It supports author, mentions, reactions, attachments metadata, and edited state at the schema level.
- Activity: A log record for important actions such as task updates, comments, workspace joins, and attachment events.
- Invite: A workspace invitation record tied to a user, workspace, token, role, and expiry.
- Verification: A token record used for email verification and password reset flows.

## 2. Current Tech Stack

Frontend stack observed in `client/package.json` and source files:

- React 19.
- React Router v7 framework mode.
- TypeScript.
- Vite.
- Tailwind CSS v4.
- shadcn/Radix-style UI components.
- TanStack React Query.
- Axios.
- React Hook Form.
- Zod.
- Recharts.
- Sonner.
- Lucide React icons.
- date-fns.

Backend stack observed in `server/package.json` and source files:

- Node.js.
- Express 4.
- ES modules.
- MongoDB through Mongoose.
- JWT authentication with `jsonwebtoken`.
- Password hashing with `bcrypt`.
- Request validation with Zod and `zod-express-middleware`.
- CORS middleware.
- Morgan HTTP logging.
- dotenv for environment loading.
- Nodemon for development.

Database and third-party services:

- MongoDB is the primary database.
- SendGrid is used for sending verification, reset password, and invitation emails.
- Arcjet is configured for shielding, bot detection, email validation, and token-bucket rate limiting.

Only the services and libraries above were observed in package files and source code.

## 3. Current Project Structure

Top-level structure:

- `client/`: React Router frontend application.
- `server/`: Express/Mongoose backend API.
- `Task-Description.txt`: Original development notes.
- `.gitignore`: Repository ignore file.

Important frontend folders and files:

- `client/app/routes.ts`: React Router route configuration.
- `client/app/root.tsx`: Root app shell and provider entry.
- `client/app/routes/`: Route components grouped by auth, dashboard, root, and user pages.
- `client/app/components/`: Reusable UI and domain components.
- `client/app/components/ui/`: shadcn/Radix-style base UI components.
- `client/app/hooks/`: React Query hooks for auth, workspace, project, task, and user API calls.
- `client/app/lib/`: API utilities, Zod schemas, shared helpers, and workspace localStorage helpers.
- `client/app/provider/`: React Query provider, auth context, and theme provider.
- `client/app/types/index.ts`: Shared frontend TypeScript domain types.
- `client/app/app.css`: Global styling and Tailwind setup.
- `client/vite.config.ts`: Vite and React Router plugin configuration.
- `client/tsconfig.json`: TypeScript configuration.

Important backend folders and files:

- `server/index.js`: Express server entry point.
- `server/routes/`: API route groups.
- `server/controllers/`: Request handlers and business logic.
- `server/models/`: Mongoose schemas and models.
- `server/middleware/`: Authentication middleware.
- `server/libs/`: Shared backend utilities for validation, email, Arcjet, and activity logging.
- `server/env.example`: Example environment configuration.
- `server/package.json`: Backend scripts and dependencies.

## 4. Frontend Architecture

Routing:

Routes are defined in `client/app/routes.ts`.

Public/auth-facing routes are grouped under `routes/auth/auth-layout.tsx`:

- `/`
- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

Authenticated dashboard routes are grouped under `routes/dashboard/dashboard-layout.tsx`:

- `/dashboard`
- `/workspaces`
- `/workspaces/:workspaceId`
- `/workspaces/:workspaceId/projects/:projectId`
- `/workspaces/:workspaceId/projects/:projectId/tasks/:taskId`
- `/my-tasks`
- `/members`
- `/settings`

Other routes:

- `/workspace-invite/:workspaceId`
- `/user/profile`

Auth provider/context:

- `client/app/provider/auth-context.tsx` defines `AuthProvider` and `useAuth`.
- Auth state is initialized from localStorage.
- Login stores `token` and `user` in localStorage.
- Logout removes auth values, clears the React Query cache, and redirects to `/`.
- A global `force-logout` browser event is used by the API layer to trigger logout after `401` responses.

API/fetch utility layer:

- `client/app/lib/fetch-utils.ts` creates a shared Axios instance.
- The base URL comes from `VITE_API_URL` or defaults to `http://localhost:5000/api-v1`.
- A request interceptor attaches `Authorization: Bearer <token>` when a token exists.
- A response interceptor dispatches `force-logout` on `401`.
- Helper functions include `postData`, `updateData`, `fetchData`, and `deleteData`.

React Query usage:

- `client/app/provider/react-query-provider.tsx` creates a single `QueryClient`.
- Hooks use `useQuery`, `useMutation`, and query invalidation after mutations.
- React Query is used for server state such as workspaces, projects, tasks, comments, and dashboard stats.

Important hooks:

- `client/app/hooks/use-auth.ts`: sign up, login, verify email, forgot password, reset password.
- `client/app/hooks/use-workspace.ts`: create/list/detail workspace, stats, invite, accept invite.
- `client/app/hooks/use-project.ts`: create project and fetch project tasks.
- `client/app/hooks/use-task.ts`: create/update tasks, subtasks, comments, watchers, archive, and my tasks.
- `client/app/hooks/use-user.ts`: user profile-related behavior exists in the repo and should be reviewed in Phase 1 when profile work is planned.

Important components:

- Dashboard components: `StatsCard`, `StatisticsCharts`, `RecentProjects`, `NoWorkspaceSelected`.
- Workspace components: `CreateWorkspace`, `WorkspaceHeader`, `WorkspaceAvatar`, `ProjectList`, `InviteMember`.
- Project components: `CreateProject`, `projetc-card.tsx`.
- Task components: `CreateTaskDialog`, `TaskTitle`, `TaskDescription`, `TaskStatusSelector`, `TaskPrioritySelector`, `TaskAssigneesSelector`, `SubTasksDetails`, `CommentSection`, `TaskActivity`, `Watchers`.
- Layout components: `Header`, `SidebarComponent`, `SidebarNav`.

## 5. Backend Architecture

Server entry point:

- `server/index.js` loads environment variables, creates the Express app, configures CORS, enables Morgan logging, connects to MongoDB, parses JSON, mounts `/api-v1` routes, and starts the server.
- The root endpoint `/` returns a welcome JSON message.
- Error and not-found middleware are registered after route mounting.

Route groups:

- `server/routes/auth.js`: registration, login, email verification, reset password request, reset password.
- `server/routes/workspace.js`: workspace CRUD-like creation/list/detail, workspace projects, stats, invites, invite acceptance.
- `server/routes/project.js`: create project, get project details, get project tasks.
- `server/routes/task.js`: create task, update task fields, subtasks, comments, watchers, archive/unarchive, activity, my tasks.
- `server/routes/user.js`: profile, profile update, change password.
- `server/routes/index.js`: mounts all route groups under `/api-v1`.

Controllers:

- `auth-controller.js`: account registration, login, email verification, password reset flows.
- `workspace.js`: workspace creation/list/details/projects/stats, member invitations, invite acceptance.
- `project.js`: project creation and project read/task listing.
- `task.js`: task creation, reads, field updates, subtasks, comments, activity logs, watchers, archive state, my tasks.
- `user.js`: profile retrieval/update and password change.

Middleware:

- `server/middleware/auth-middleware.js` reads the Bearer token, verifies it with `JWT_SECRET`, loads the user from MongoDB, and attaches `req.user`.
- Request validation is applied in route files with `zod-express-middleware`.

Models:

- Mongoose models live in `server/models/`.
- Models define the application data shape and relationships through ObjectId references.

Auth flow:

1. Registration validates input, checks Arcjet email protection, checks duplicate email, hashes password, creates user, creates a verification token, stores a `Verification` record, and sends email.
2. Email verification validates the JWT purpose, checks the stored verification record, checks expiry, marks the user verified, and deletes the verification record.
3. Login loads the user with password, requires email verification, compares password, creates a login JWT, updates `lastLogin`, and returns token plus user.
4. Password reset request creates a short-lived reset token and sends a reset email.
5. Password reset validates token purpose and stored verification record, compares password confirmation, hashes the new password, saves it, and deletes the verification record.

## 6. Data Model Overview

User (`server/models/User.js`):

- Fields: `name`, `email`, `password`, `profilePicture`, `isEmailVerified`, `lastLogin`, `is2FAEnabled`, `twoFAOtp`, `twoFAOtpExpires`.
- `password`, `twoFAOtp`, and `twoFAOtpExpires` are excluded by default through `select: false`.
- Relationships: referenced by workspaces, projects, tasks, comments, activities, invites, and verification records.

Workspace (`server/models/workspace.js`):

- Fields: `name`, `description`, `color`, `owner`, `members`, `projects`.
- `owner` references User.
- `members[].user` references User and includes a role plus `joinedAt`.
- `projects[]` references Project.

Project (`server/models/project.js`):

- Fields: `title`, `description`, `workspace`, `status`, `startDate`, `dueDate`, `progress`, `tasks`, `members`, `tags`, `createdBy`, `isArchived`.
- `workspace` references Workspace.
- `tasks[]` references Task.
- `members[].user` references User.
- `createdBy` references User.

Task (`server/models/task.js`):

- Fields: `title`, `description`, `project`, `status`, `priority`, `assignees`, `watchers`, `dueDate`, `completedAt`, `estimatedHours`, `actualHours`, `tags`, `subtasks`, `comments`, `attachments`, `createdBy`, `isArchived`.
- `project` references Project.
- `assignees[]`, `watchers[]`, `createdBy`, and `attachments[].uploadedBy` reference User.
- `comments[]` references Comment.
- Subtasks are embedded documents.
- Attachments are metadata-only embedded documents in the current schema.

Comment (`server/models/comment.js`):

- Fields: `text`, `task`, `author`, `mentions`, `reactions`, `attachments`, `isEdited`.
- `task` references Task.
- `author`, `mentions[].user`, and `reactions[].user` reference User.

Activity (`server/models/activity.js`):

- Fields: `user`, `action`, `resourceType`, `resourceId`, `details`.
- `user` references User.
- `resourceId` is a generic ObjectId for Task, Project, Workspace, Comment, or User resources.

WorkspaceInvite (`server/models/workspace-invite.js`):

- Fields: `user`, `workspaceId`, `token`, `role`, `expiresAt`.
- `user` references User.
- `workspaceId` references Workspace.

Verification (`server/models/verification.js`):

- Fields: `userId`, `token`, `expiresAt`.
- `userId` references User.
- Used for both email verification and password reset flows.

Relationship summary:

- A User can own and belong to many Workspaces.
- A Workspace contains many Projects and many Members.
- A Project belongs to one Workspace, contains many Tasks, and has project members.
- A Task belongs to one Project, has many assignees/watchers, has embedded subtasks, and references comments.
- A Comment belongs to one Task and one author.
- An Activity record points to a user and a generic resource.
- An Invite links a user to a workspace through a token.
- A Verification links a user to a temporary token.

## 7. Existing Feature Inventory

The following features appear to be supported by current code:

- Authentication: registration, login, JWT token issuance, frontend auth context, protected backend routes.
- Email verification: verification token model, email link generation, verification endpoint.
- Password reset: reset request endpoint, reset token generation, reset password endpoint.
- Workspace management: create workspace, list user's workspaces, get workspace details, get workspace projects.
- Project management: create project, get project details, get project tasks.
- Task management: create task, fetch task, update title, description, status, assignees, priority, archive/unarchive.
- Comments: add comment and list comments for a task.
- Subtasks: add subtask and update subtask completion.
- Watchers: watch/unwatch task and list watchers in task details.
- Activity logs: record selected task/workspace actions and fetch activity by resource id.
- Dashboard stats: workspace stats, trend data, project status data, task priority data, productivity data, upcoming tasks, recent projects.
- Invitations: invite existing users to workspace by email, accept invite by token, generated invite acceptance endpoint.
- User profile: fetch profile, update profile, change password.
- Theme preference: frontend light/dark theme provider.

Notable partial/schema-only areas:

- Comment mentions, reactions, and attachments are modeled, but full UI/API behavior for managing them was not confirmed.
- Task attachments are modeled, but upload/storage endpoints were not observed.
- User 2FA fields exist on the model, but complete 2FA flow endpoints were not observed.

## 8. Current Health Checks

Package scripts inspected:

Client `client/package.json`:

- `npm run build`: `react-router build`
- `npm run dev`: `react-router dev`
- `npm run start`: `react-router-serve ./build/server/index.js`
- `npm run typecheck`: `react-router typegen && tsc`
- No test script observed.
- No lint script observed.

Server `server/package.json`:

- `npm run dev`: `nodemon index.js`
- `npm run start`: `node index.js`
- `npm run test`: placeholder command that exits with an error.
- No lint script observed.
- No real automated test command observed.

Commands run during Phase 0:

| Area | Command | Result | Notes |
| --- | --- | --- | --- |
| Repository inspection | `Get-ChildItem -Force` | Passed | Listed top-level files/folders. |
| Repository inspection | `rg --files` | Passed | Listed project files. |
| Client scripts | `Get-Content client\\package.json` | Passed | Inspected scripts and dependencies. |
| Server scripts | `Get-Content server\\package.json` | Passed | Inspected scripts and dependencies. |
| Backend syntax | `node --check index.js` from `server/` | Passed | `server/index.js` has valid Node syntax. |
| Frontend typecheck | `npm run typecheck` from `client/` | Passed | React Router typegen and TypeScript completed successfully. |
| Docs folder check | `Test-Path docs` | Passed | Returned `False`; folder did not exist before this audit. |
| Docs folder creation | `New-Item -ItemType Directory -Path docs` | Passed | Created `docs/`. |

No `.env` files containing real values were printed, modified, or requested.

## 9. Known Issues and Risks

### 1. Backend MongoDB environment variable mismatch

- File path: `server/index.js`, `server/env.example`
- Problem: The server connects with `process.env.MONGO_URI`, but `server/env.example` documents `MONGODB_URI`.
- Impact: New developers may configure the documented variable and still fail to connect to MongoDB.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 2. CORS default mismatch with frontend dev port

- File path: `server/index.js`, `server/env.example`, `client/README.md`
- Problem: Backend CORS fallback is `http://localhost:3000`, while the React Router dev server is documented as `http://localhost:5173` and `server/env.example` uses `CLIENT_URL=http://localhost:5173`.
- Impact: If `CLIENT_URL` is missing, local frontend requests may be blocked by CORS.
- Recommended phase to fix: Phase 1.
- Priority: Medium.

### 3. Workspace localStorage key mismatch

- File path: `client/app/provider/auth-context.tsx`, `client/app/lib/workspace-storage.ts`
- Problem: Workspace persistence uses `lastAccessedWorkspaceId`, but logout removes `last-accessed-workspace`.
- Impact: Logout may leave stale workspace selection data behind, causing confusing workspace selection after future login.
- Recommended phase to fix: Phase 1.
- Priority: Low.

### 4. Authorization gap in workspace details read endpoint

- File path: `server/controllers/workspace.js`
- Problem: `getWorkspaceDetails` fetches a workspace by ID and returns it without verifying `req.user` is a workspace member.
- Impact: An authenticated user may be able to access metadata and member information for a workspace they do not belong to if they know or guess the ID.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 5. Authorization gap in task details read endpoint

- File path: `server/controllers/task.js`
- Problem: `getTaskById` fetches and returns a task plus project without verifying that `req.user` belongs to the project or workspace.
- Impact: Authenticated users may be able to read task details for projects they do not belong to if they know or guess the task ID.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 6. Authorization gap in task activity read endpoint

- File path: `server/controllers/task.js`
- Problem: `getActivityByResourceId` returns activity by arbitrary resource ID without checking membership against the underlying resource.
- Impact: Activity history may leak details across workspace/project boundaries.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 7. Authorization gap in task comments read endpoint

- File path: `server/controllers/task.js`
- Problem: `getCommentsByTaskId` returns comments for a task ID without confirming the requester can access that task.
- Impact: Task discussion content may be readable by unauthorized authenticated users who know a task ID.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 8. Workspace stats trend loop uses `for...in` instead of `for...of`

- File path: `server/controllers/workspace.js`
- Problem: In `getWorkspaceStats`, the loop uses `for (const task in project.tasks)`, which iterates indexes, not task objects. The code then reads `task.updatedAt` and `task.status` from the index string.
- Impact: Task trend chart data is likely incorrect and may silently remain zero.
- Recommended phase to fix: Phase 1.
- Priority: Medium.

### 9. Task status mismatch around `Review`

- File path: `server/models/task.js`, `server/libs/validate-schema.js`, `client/app/lib/schema.ts`, `client/app/types/index.ts`
- Problem: The Mongoose task model allows `Review`, but backend validation and frontend schemas/types mostly allow only `To Do`, `In Progress`, and `Done`.
- Impact: Status behavior is inconsistent. Existing or future `Review` tasks may be unsupported by forms, validation, charts, or UI filters.
- Recommended phase to fix: Phase 1.
- Priority: Medium.

### 10. Typo in project card filename

- File path: `client/app/components/project/projetc-card.tsx`
- Problem: Filename appears to be misspelled as `projetc-card.tsx`.
- Impact: Low runtime risk, but it can confuse developers and imports during future work.
- Recommended phase to fix: Phase 1 or later cleanup.
- Priority: Low.

### 11. Lack of backend automated tests

- File path: `server/package.json`
- Problem: The server `test` script is a placeholder that exits with an error. No real backend test runner or API test suite was observed.
- Impact: Backend changes to auth, permissions, and task/workspace behavior have higher regression risk.
- Recommended phase to fix: Phase 1 or Phase 2.
- Priority: Medium.

### 12. Login unverified-email resend path may dereference null

- File path: `server/controllers/auth-controller.js`
- Problem: In `loginUser`, when a user is unverified and there is no existing verification record, the code enters the `else` branch and calls `Verification.findByIdAndDelete(existingVerification._id)`. If `existingVerification` is null, this can throw.
- Impact: Some unverified users may get a server error instead of receiving a new verification email.
- Recommended phase to fix: Phase 1.
- Priority: Medium.

### 13. Task description update assumes existing description

- File path: `server/controllers/task.js`
- Problem: `updateTaskDescription` calls `task.description.substring(...)`. If `task.description` is undefined or empty on an existing task, this can throw.
- Impact: Updating the description of tasks created without a description may fail.
- Recommended phase to fix: Phase 1.
- Priority: Medium.

### 14. Subtask update lacks membership authorization check

- File path: `server/controllers/task.js`
- Problem: `updateSubTask` checks task and subtask existence, but does not verify the requester belongs to the project/workspace.
- Impact: Authenticated users who know task and subtask IDs may be able to alter subtask completion state.
- Recommended phase to fix: Phase 1.
- Priority: High.

### 15. Generic update validation does not constrain status/priority values

- File path: `server/routes/task.js`
- Problem: `PUT /:taskId/status` validates `status` as any string, and `PUT /:taskId/priority` validates `priority` as any string. Mongoose enum validation may still reject invalid values on save, but the API boundary is looser than the create-task schema.
- Impact: Error handling and validation messages may be inconsistent.
- Recommended phase to fix: Phase 1.
- Priority: Low.

## 10. Phase 1 Readiness Checklist

- [ ] Config cleanup: standardize required environment variable names across code and examples.
- [ ] Env validation: add startup validation for required backend variables such as MongoDB URI, JWT secret, client URL, SendGrid settings, and Arcjet key/mode.
- [ ] `.env.example` cleanup: make example variable names match the exact names used in code.
- [ ] CORS cleanup: align default local frontend origin with the actual React Router dev port.
- [ ] localStorage key cleanup: use one shared constant or helper for last-accessed workspace storage and logout cleanup.
- [ ] Startup consistency checks: fail fast with clear messages when required backend configuration is missing.
- [ ] Authorization consistency audit: add reusable access checks for workspace, project, task, comments, activity, and subtask endpoints.
- [ ] Status consistency cleanup: decide whether `Review` is a real task status and align model, backend validation, frontend schema, frontend types, UI filters, and dashboard analytics.
- [ ] Health-check scripts: add real backend test/lint scripts or document that they are intentionally absent.
- [ ] Developer documentation: add local setup steps that do not expose real secrets and explain which example env values must be replaced locally.

## 11. Recommended Next Steps

After Phase 0, Phase 1 should focus on hardening and consistency rather than new features. The best next work is to clean up configuration, validate required environment variables at startup, align local development defaults, fix stale localStorage cleanup, close read/write authorization gaps, and normalize task status values.

After Phase 1, the project will be safer for feature development. Good Phase 2 candidates include backend API tests, role-based permission tests, project editing/deletion, workspace member management, file upload support for attachments, notification behavior for watchers/mentions, and stronger dashboard correctness tests.
