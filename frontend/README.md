# Eventora Frontend Workspace

Eventora is a digital management and sponsor matching network that directly connects Event Organizers and Corporate Sponsors. This folder contains the complete, high-fidelity React frontend codebase.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+ recommended) and npm installed.

### Setup and Development
1. **Navigate into the frontend workspace**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start local development server**:
   ```bash
   npm run dev
   ```
4. **Compile / Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🔑 Test Credentials
Use the following pre-configured backend accounts for validating flows and roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Platform Administrator** | `admin@eventora.test` | `password123` |
| **Event Organizer** | `organisasi@eventora.test` | `password123` |
| **Corporate Sponsor** | `perusahaan@eventora.test` | `password123` |

---

## 🛠 Tech Stack & Architecture

- **Core Framework**: React 19 + TypeScript + Vite
- **Styling Engine**: Tailwind CSS v3 (Curated startup-enterprise colors defined in `tailwind.config.js`)
- **Routing**: React Router v7 (Guarded and nested route architectures)
- **State Management**: Zustand (Global authenticated state, profile contexts, and token storage)
- **Data Querying & Mutations**: `@tanstack/react-query` (Configured with central query invalidation, background polling, and mutation callbacks)
- **Networking**: Axios (Configured in `src/lib/api.ts` with global request headers, auto-invalidation, and error handling)
- **UI Components**: custom premium layout elements matching `docs/DESIGN.md` guidelines.

---

## 📂 Project Structure

- [`src/components/layout/`](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/frontend/src/components/layout):
  - `LandingLayout.tsx` & `LandingNavbar.tsx`: Custom navbar and footer for public landing, auth, and about screens.
  - `DashboardLayout.tsx` & `TopNavbar.tsx`: Private app wrapper with real-time notification polling and quick role navigations.
  - `AdminLayout.tsx` & `AdminSidebar.tsx`: Dashboard with responsive side drawer for mobile and tablets.
  - `ProtectedRoute.tsx`, `RoleRoute.tsx`, & `ProfileCompletionGuard.tsx`: Security guards for authentication validation, role restriction, and compulsory profile setup redirects.
- [`src/components/shared/`](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/frontend/src/components/shared):
  - `DataTable.tsx`: Reusable search, filter, and paginated data table.
  - `ConfirmDialog.tsx`: Action confirm popups.
  - `FileUpload.tsx`: Standardized file upload dropzones with size/type validation.
  - `LocationSelect.tsx`: Cascade drop-down selection for Provinces and Cities.
  - `StatusBadge.tsx`: Color-coded semantic status chips.
- [`src/hooks/useLocation.ts`](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/frontend/src/hooks/useLocation.ts):
  - Fetches Indonesian province and city names using proxy APIs (`/location/provinces` and `/location/cities/{province_id}`).
  - Implements a 24-hour cache staleTime to minimize backend requests.
- [`src/routes/`](file:///d:/MANAJEMEN%20INFORMATIKA%202024/UAS%20WEB%20N%20API/Eventora/frontend/src/routes):
  - Contains individual screen components for all platform workflows.

---

## 🔒 Security & Route Mapping

- `/` (Public): Eventora landing.
- `/about` (Public): System architecture and goal information.
- `/login` / `/register` (Guests): Authentication gates.
- `/profile-completion` (Authenticated): Block screen requiring new profiles to complete their location, description, and contact info before proceeding.
- `/dashboard` (Authenticated): Switcher page loading the specific dashboard matching the user's role.
- `/admin/*` (Admins): System stats, user moderation, event list moderation, system-wide sponsorships monitoring, export reporting tools, and account privileges.
