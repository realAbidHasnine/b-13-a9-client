# IdeaVault

A platform to share, discover, and discuss startup ideas. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and Better Auth for authentication.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Authentication:** Better Auth with email/password and Google OAuth, MongoDB adapter
- **Backend API:** Separate Express server (deployed at `b-13-a9-server.vercel.app`)
- **Database:** MongoDB
- **Fonts:** Geist, Inter, Instrument Serif, DM Sans

## Project Structure

```
src/
  app/
    page.jsx            -- Home page (hero slider, trending ideas, how-it-works)
    layout.jsx          -- Root layout (Navbar, Footer, ToastContainer, TokenSync)
    not-found.jsx       -- 404 page
    globals.css         -- Global styles
    login/page.jsx      -- Login (email/password + Google)
    register/page.jsx   -- Registration
    ideas/page.jsx      -- Browse all ideas with search & category filter
    ideas/[id]/page.jsx -- Idea detail page with tabs and comments
    add-idea/page.jsx   -- Form to submit a new idea
    my-ideas/page.jsx   -- List own ideas with edit modal and delete
    my-interactions/page.jsx -- Ideas the user has commented on
    profile/page.jsx    -- Edit display name and photo URL
    api/auth/[...all]/  -- Better Auth API routes
  components/
    NavBar.jsx          -- Responsive navigation with user dropdown
    Footer.jsx          -- Site footer
    IdeaCard.jsx        -- Styled card for displaying an idea
    HeroSlider.jsx      -- Hero section on the landing page
    LoadingSpinner.jsx  -- Loading state component
    EmptyState.jsx      -- Empty state with icon and action button
    ErrorMessage.jsx    -- Error display with retry button
    PrivateRoute.jsx    -- Auth guard that redirects unauthenticated users
    TokenSync.jsx       -- Syncs Better Auth session to a backend JWT
  lib/
    auth-client.js      -- Better Auth client (signIn, signUp, signOut, useSession)
    auth.js             -- Server-side Better Auth config (MongoDB, JWT, Google)
  utils/
    apiFetch.js         -- Fetch wrapper that attaches JWT Bearer token
  proxy.js              -- Next.js middleware for route protection
```

## Authentication Flow

1. Better Auth handles authentication client-side via `src/lib/auth-client.js`
2. When a user logs in, the `TokenSync` component fetches a backend JWT from `POST /jwt` and stores it in `localStorage` as `access_token`
3. `apiFetch` reads the token from `localStorage` and attaches it as a `Bearer` header to all API requests
4. `PrivateRoute` guards authenticated pages and redirects to `/login` if not authenticated
5. `proxy.js` middleware also protects routes server-side and redirects authenticated users away from `/login` and `/register`

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with hero slider, trending ideas grid, how-it-works section, feature highlights |
| `/ideas` | Public | Browse all ideas with text search and category filter (Tech, Health, AI, Education, Finance, Environment, Social, Entertainment, Other) |
| `/ideas/[id]` | Auth required | Idea detail with tabs (Overview, Problem & Solution, Details), author sidebar, budget/tags, and comment thread with edit/delete |
| `/add-idea` | Auth required | Form: title, short description, category, cover image URL, problem statement, proposed solution, detailed description, target audience, estimated budget, tags |
| `/my-ideas` | Auth required | List user's own ideas with inline edit modal and delete confirmation |
| `/my-interactions` | Auth required | Shows ideas the user has commented on |
| `/profile` | Auth required | Edit display name and photo URL |
| `/login` | Public (redirects if authed) | Login via email/password or Google OAuth |
| `/register` | Public (redirects if authed) | Registration |

## API Endpoints (Backend)

All requests go through `apiFetch` which prepends `NEXT_PUBLIC_API_URL` and attaches the JWT:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/ideas` | List ideas (supports `?search=` and `?category=` params) |
| GET | `/ideas/:id` | Get single idea |
| POST | `/ideas` | Create new idea |
| PATCH | `/ideas/:id` | Update idea |
| DELETE | `/ideas/:id` | Delete idea |
| GET | `/comments/:ideaId` | List comments for an idea |
| POST | `/comments` | Create comment |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |
| GET | `/my-ideas` | List current user's ideas |
| GET | `/my-interactions` | List current user's comment interactions |
| POST | `/jwt` | Exchange Better Auth session for a backend JWT |

## Environment Variables

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=<secret>
MONGODB_URI=<mongodb-connection-string>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
NEXT_PUBLIC_API_URL=https://b-13-a9-server.vercel.app
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` -- Start development server
- `npm run build` -- Build for production
- `npm run start` -- Start production server
- `npm run lint` -- Run ESLint

## Live->

- https://b-13-a9-client.vercel.app/