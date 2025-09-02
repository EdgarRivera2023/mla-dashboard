# DataLink Web - Project Roadmap

## Phase 1: MVP for User Adoption
_Goal: Build a complete, user-friendly interface on top of Podio that the team can start using for their daily work._

### User & Role Management
- [x] Add 'role' to the user model (e.g., 'user' vs. 'admin').
- [x] Implement logic to show/hide UI elements based on user role.

### Core UI & Navigation
- [x] Redirect users to `/dashboard` immediately after they log in.
- [x] Design a Basic App Layout (Sidebar and Header).
- [x] Implement User Logout.
- [x] Add 'Edit' and 'View Details' buttons to the item list rows.
- [x] Add a prominent "New Case" button.

### Dashboard Functionality
- [x] Build the Main Dashboard Page (Initial version).
- [ ] Redesign the Dashboard page to have a tabbed interface (User Tabs + Admin Master Tab).
- [ ] Create a backend API route to fetch a user's specific "Views" from Podio.
- [ ] Build the two-panel dashboard layout (Views list on left, Item table on right).
- [ ] Create a backend API route to fetch the items that belong to a selected View.

### CRUD Functionality
- [x] Add all remaining 'Casos' fields to the Create and Edit forms.
- [ ] Fix data formatting for Money, Category, and Reference fields in API handlers.
- [x] Create "List View" for all 'Casos'.
- [x] Create "Detail View" for a single 'Caso'. (Functionality merged into Edit page).
- [x] Build "New Item" Form. (Full version).
- [x] Build "Edit Item" Form. (Full version).
- [x] Develop Podio API Handlers for all CRUD actions.
- [x] Add a search bar to the "List View".

### User Experience
- [x] Improve user feedback (loading spinners, success/error pop-up notifications).
- [ ] Implement SmrtPhone Click-to-Call (via Chrome Extension and `tel:` links).

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