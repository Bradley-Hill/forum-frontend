# forum-frontend

## Tech Stack & Approach

### Framework & Language
- React (with Vite for fast development)
- TypeScript
- Vite

### State Management
- React Context API: For SPA navigation, nested routes and route guards.
- Consider Redux for complex state or as a learning opportunity
- Best Practice: Keep State as local as possible; lift state only when absolutely necessary.

### Routing
- react-router-dom for client-side routing
- Planned Routes:
    - / (Home/Forum Index)
    -/login, /register
    - /categories, /categories/:id
    - /threads/:id
    - /posts/:id
    - /user/:id
    - /admin (if applicable)
    - 404 Handling: Custom not-found page.

### API Integration

- Options under consideration: 
    - fetch (native, minimal dependencies)
    - axios (feature-rich, interceptors)
    - react-query or SWR (data fetching, caching, auto-refetch)
Will discuss and finalize based on project needs.
(Planned Features:
- Centralized API utility for requests
- Error handling and user feedback
- Token management for authenticated requests
)

### Authentication
- Integration: connects with backend auth endpoints
- Features:
    - Login, registration, logout
    - JWT or session token storage (localStorage or cookies)
    - Protected routes (redirect unauthenticated users)
    - User context for current user info

### Testing
- Vitest for unit and integration testing
- Testing Focus:
    - Components (UI, logic)
    - API utilities (mocking backend)
    - Routing and protected routes
    - End-to-end (E2E) tests (potentially with Playwright)

### Styling
Styling Options:
- CSS Modules (scoped styles)
- SCSS (nesting, variables)
- styled-components (CSS-in-JS, dynamic styling)
Approach:
- Organized folder structure for styles
- Theming support for future extensibility
- Accessibility and responsive design

### UI/UX Design
- Inspired by classic forums (e.g., Giant in the Playground: https://forums.giantitp.com/)
Tools: 
- Figma for wireframes and prototypes
Design Goals:
- Intuitive navigation
- Readable, accessible layouts
- Mobile responsiveness

### Component Structure
Planned Components:
- Layout: Header, Footer, Sidebar, MainContent
- Forum: CategoryList, ThreadList, PostList, PostEditor
- User: UserProfile, UserMenu, AuthForms
- Admin: AdminPanel, UserManagement
- Shared: Button, Modal, Loader, Alert, Pagination
Approach:
- Atomic design principles (atoms, molecules, organisms)
- Reusability and composability

## NEXT STEPS

1. UI/UX Wireframes: Sketch out the main pages and flows in Figma. This will clarify your component needs and user journeys.

2. API Contract Review: Document the expected data structures and endpoints between frontend and backend. This helps avoid integration surprises.

3. Component Breakdown: Create a detailed list or diagram of all components, their props, and relationships (atomic design).

4. Routing Map: Draft a visual map of your planned routes and how they connect, including protected routes and error handling.

5. Authentication Flow: Plan the login, registration, token storage, and protected route logic in detail.

6. Styling Architecture: Decide on your CSS/scoping approach and folder structure for styles.

7. Feasibility Checks: Identify any technical unknowns (e.g., SSR, accessibility, mobile support) and do small proofs-of-concept if needed.