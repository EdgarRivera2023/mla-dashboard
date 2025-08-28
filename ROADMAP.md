# DataLink Web - Project Roadmap

## Phase 1: MVP for User Adoption
_Goal: Build a complete, user-friendly interface on top of Podio that the team can start using for their daily work._

### User & Role Management
- [ ] Add 'role' to the user model (e.g., 'user' vs. 'admin').
- [ ] Implement logic to show/hide UI elements based on user role.

### Core UI & Navigation
- [ ] Redirect users to `/dashboard` immediately after they log in.
- [ ] Create a top navigation bar for global App links (with admin-only visibility).
- [x] Design a Basic App Layout (Sidebar and Header).
- [x] Implement User Logout.
- [ ] Add 'Edit' and 'View Details' buttons to the item list rows.
- [ ] Add a prominent "New Case" button.

### Dashboard Functionality
- [x] Build the Main Dashboard Page (Initial version).
- [ ] Redesign the Dashboard page to have a tabbed interface (User Tabs + Admin Master Tab).
- [ ] Create a backend API route to fetch a user's specific "Views" from Podio.
- [ ] Build the two-panel dashboard layout (Views list on left, Item table on right).
- [ ] Create a backend API route to fetch the items that belong to a selected View.

### CRUD Functionality
- [x] Create "List View" for all 'Casos'.
- [x] Create "Detail View" for a single 'Caso'.
- [x] Build "New Item" Form.
- [x] Build "Edit Item" Form.
- [x] Develop Podio API Handlers for all CRUD actions.
- [ ] Add a search bar to the "List View".

### User Experience
- [ ] Improve user feedback (loading spinners, success/error pop-up notifications).

---

## Phase 2: The 'Strangler' Integration (Backend Migration)
_Goal: Silently introduce PostgreSQL and begin migrating data and logic away from Podio without user interruption._

- [ ] Set Up Vercel Postgres Database
- [ ] Define Database Schema with Prisma
- [ ] Run Initial Data Migration from Podio
- [ ] Implement Dual-Writes for Create/Update actions
- [ ] Implement Podio Webhook for external changes
- [ ] "Strangle the Reads" (switch all data fetching to use PostgreSQL)

---

## Phase 3: The Final Cutover
_Goal: Completely remove the dependency on Podio._

- [ ] Remove all Podio API Calls from the code
- [ ] Deactivate Podio Webhooks
- [ ] Perform Final Data Verification
- [ ] Code Cleanup and Refactor
- [ ] Archive Podio Workspace