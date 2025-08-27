# DataLink Web - Project Roadmap

## Phase 1: Podio-Powered Front-End
- [X] Design a Basic App Layout
- [ ] Implement User Logout
- [ ] Build the Main Dashboard Page
- [ ] Create "List View" for a Core Item (e.g., Clients)
- [ ] Create "Detail View" for a single item
- [ ] Build "New Item" Form
- [ ] Build "Edit Item" Form
- [ ] Develop Podio API Handlers for all actions

## Phase 2: The 'Strangler' Integration
- [ ] Set Up Vercel Postgres Database
- [ ] Define Database Schema with Prisma
- [ ] Run Initial Data Migration from Podio
- [ ] Implement Dual-Writes for Create/Update actions
- [ ] Implement Podio Webhook for external changes
- [ ] "Strangle the Reads" (switch list/detail views to use PostgreSQL)

## Phase 3: The Final Cutover
- [ ] Remove all Podio API Calls from the code
- [ ] Deactivate Podio Webhooks
- [ ] Perform Final Data Verification
- [ ] Code Cleanup and Refactor
- [ ] Archive Podio Workspace