# DESIGN.md
# Eventora Frontend Design System and Interface Direction

## 1. Document Purpose

Dokumen ini menjadi pedoman desain frontend Eventora agar tampilan landing page dan dashboard tidak terlihat generic, tidak terasa seperti template AI, dan tetap mudah dikembangkan menggunakan React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, serta integrasi komponen referensi dari 21st.dev.

Dokumen ini harus digunakan bersama:

```text
docs/PRD.md
docs/DATABASE_RULES.md
docs/FLOW.md
```

Urutan prioritas untuk frontend:

```text
FLOW.md
DESIGN.md
PRD.md
DATABASE_RULES.md
```

DESIGN.md mengatur:

```text
visual direction
layout
motion
component behavior
landing page sections
role-based dashboard interface
frontend architecture ringan
anti AI slop rules
21st.dev component adaptation rules
```

Dokumen ini tidak berisi one shot prompt Antigravity frontend. Prompt frontend harus dibuat dalam file terpisah.

---

## 2. Product Visual Positioning

Eventora adalah platform digital sponsorship management system yang menghubungkan Event Organizer dan Company melalui proses apply sponsorship yang profesional, terukur, dan transparan.

Arah visual utama:

```text
modern startup
marketplace sponsorship
enterprise platform
event management product
professional collaboration tool
```

Eventora tidak boleh terlihat seperti:

```text
website kampus biasa
dashboard admin CRUD generik
landing page SaaS palsu
template neon AI
aplikasi event yang terlalu ramai
```

Kesan yang harus muncul:

```text
professional
modern
collaborative
trustworthy
clean
structured
premium but still approachable
```

---

## 3. Brand Personality

Eventora harus terasa seperti platform yang membantu organisasi mengubah proses sponsorship yang manual menjadi workflow digital yang rapi.

Brand personality:

| Aspek | Arah |
|---|---|
| Personality | Modern, professional, collaborative |
| Visual Style | Clean, glassy, minimal, structured |
| Product Feel | Startup SaaS + enterprise dashboard |
| Tone | Friendly startup |
| Language | Full English for UI copy |
| Motion | Minimal but premium |
| Dashboard Feel | Enterprise, calm, focused |
| Landing Page Feel | Product showcase, animated, polished |

Core message:

```text
Eventora helps organizers manage sponsorship applications with clarity, speed, and professional workflow.
```

Alternative hero lines:

```text
Turn sponsorship outreach into a structured workflow.
Connect organizers and companies in one sponsorship platform.
Manage events, proposals, and partnerships without scattered conversations.
```

---

## 4. Design Inspiration

Eventora mengambil inspirasi dari:

```text
Vercel
GitHub
Linear
Stripe
Pitch.com
21st.dev
modern enterprise dashboards
```

Specific direction:

| Area | Inspiration |
|---|---|
| Sidebar admin | Vercel and GitHub style |
| Landing hero | 21st.dev animated hero and text switching |
| Landing motion | Floating cards, smooth reveal, parallax |
| Testimonial | 21st.dev vertical marquee style |
| Partner logos | 21st.dev auto scrolling logo slider |
| Dashboard | Enterprise analytics interface |
| Forms | Clean SaaS forms |
| Tables | Modern data table with filters |

---

## 5. Color System

Eventora menggunakan light mode only.

### 5.1 Core Palette

| Token | Color | Usage |
|---|---|---|
| Background | `#F7F8FA` | Main app background |
| Surface | `#FFFFFF` | Cards, panels, modals |
| Surface Soft | `#F3F5F7` | Secondary sections |
| Ink | `#0B0F19` | Main text |
| Muted Ink | `#5B6573` | Secondary text |
| Border | `#E3E7ED` | Card and table border |
| Border Strong | `#CBD5E1` | Important separators |
| Primary Blue | `#1E3A5F` | Main brand action |
| Accent Blue | `#2E86AB` | Highlight, link, active state |
| Silver | `#A7B4C2` | Premium neutral accent |
| Soft Blue | `#EAF4FF` | Badge and subtle background |
| Success | `#1F9D55` | Accepted status |
| Warning | `#B7791F` | Pending or reviewed warning |
| Danger | `#D92D20` | Rejected and destructive action |
| Orange Soft | `#FFF3E6` | Cancelled status background |

### 5.2 Gradient Direction

Gradient boleh digunakan, tetapi harus subtle dan glassy.

Allowed gradient:

```css
background:
  radial-gradient(circle at 20% 20%, rgba(46, 134, 171, 0.16), transparent 28%),
  radial-gradient(circle at 80% 10%, rgba(167, 180, 194, 0.18), transparent 26%),
  linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%);
```

Allowed glass panel:

```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(18px);
border: 1px solid rgba(203, 213, 225, 0.65);
box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
```

Forbidden gradient:

```text
neon blue purple gradient
overly saturated pink purple
rainbow gradient
heavy glowing border
crypto dashboard gradient
gaming style glow
```

---

## 6. Typography

UI language must be English.

### 6.1 Font Recommendation

Primary font:

```text
Geist Sans
```

Fallback:

```text
Inter
system-ui
sans-serif
```

Why Geist Sans:

```text
closer to Vercel style
modern but not playful
clean for dashboard
sharp for landing page headline
```

Optional display accent:

```text
Manrope
```

Use Manrope only if Geist Sans is not available.

### 6.2 Type Scale

| Element | Class Direction |
|---|---|
| Hero headline | `text-5xl md:text-7xl lg:text-8xl tracking-tight font-semibold` |
| Section headline | `text-3xl md:text-5xl tracking-tight font-semibold` |
| Dashboard page title | `text-2xl md:text-3xl font-semibold tracking-tight` |
| Card title | `text-sm md:text-base font-medium` |
| Body | `text-sm md:text-base text-muted-foreground` |
| Caption | `text-xs text-muted-foreground` |
| Button | `text-sm font-medium` |

Typography rules:

```text
Do not use all caps heavily.
Do not use playful rounded fonts.
Do not use too many font weights.
Keep headings sharp, readable, and premium.
Use tight tracking for large headings.
Use comfortable line-height for descriptions.
```

---

## 7. Layout System

### 7.1 Container

Landing page:

```text
max-w-7xl
mx-auto
px-4 sm:px-6 lg:px-8
```

Dashboard:

```text
w-full
max-w-none
px-6 lg:px-8
```

### 7.2 Spacing

Landing page section spacing:

```text
py-20 md:py-28 lg:py-32
```

Dashboard page spacing:

```text
gap-6
p-6
```

Card spacing:

```text
p-5 or p-6
gap-4
```

### 7.3 Border Radius

Use restrained radius.

| Component | Radius |
|---|---|
| Button | `rounded-lg` or `rounded-xl` |
| Small badge | `rounded-full` |
| Card | `rounded-xl` |
| Dashboard panel | `rounded-xl` |
| Modal | `rounded-2xl` |
| Hero preview frame | `rounded-2xl` |

Do not make every card extremely rounded.

---

## 8. Motion and Animation System

Motion must support premium feel without reducing usability.

### 8.1 Motion Philosophy

```text
Landing page can be expressive.
Dashboard must be calm.
Animations should guide attention, not become the product.
Every motion must have functional purpose.
```

### 8.2 Allowed Motion

Landing page:

```text
switching hero text
floating cards
small card tilt
smooth reveal on scroll
subtle parallax
animated sponsorship flow
auto scrolling partner logos
testimonial vertical marquee
soft grid movement
button hover lift
```

Dashboard:

```text
page fade in
card hover shadow
modal enter and exit
table row hover
sidebar active state transition
status badge transition
loading skeleton
toast transition
```

### 8.3 Motion Libraries

Use:

```text
Framer Motion
CSS animation
```

Use GSAP only if needed for controlled landing page scroll animation.

Avoid using both `motion/react` and `framer-motion` inconsistently. If a reference component uses `motion/react`, convert it to `framer-motion` unless the project intentionally installs `motion`.

### 8.4 Motion Timing

Recommended timing:

```text
micro interaction: 120ms to 180ms
card hover: 180ms to 250ms
section reveal: 450ms to 700ms
hero switch text: 1800ms to 2400ms interval
parallax: very subtle
```

### 8.5 Reduced Motion

Respect reduced motion:

```text
If user prefers reduced motion, disable marquee, parallax, and large transform.
Keep opacity fade only.
```

Implementation direction:

```tsx
const prefersReducedMotion = useReducedMotion()
```

### 8.6 Animation Restrictions

Do not use:

```text
neon glow loops
shaking cards
bouncy childish movement
too many icons flying
background particles
3D objects
emoji animations
random confetti
overly aggressive parallax
```

---

## 9. Landing Page Design

Landing page is a product showcase.

Main goal:

```text
Explain what Eventora does, show how the sponsorship workflow works, build trust, and drive users to register.
```

Landing page route:

```text
/
```

Required public routes:

```text
/
home
about
for-organization
for-company
login
register
```

Recommended landing page sections:

```text
Navbar
Hero
Problem
Solution
How It Works
Role Explanation
Feature Highlights
Sponsorship Flow
Dashboard Preview
Testimonials
Partner Slider
CTA
Footer
```

---

## 10. Landing Navbar

### 10.1 Visual Direction

Use floating glass navbar inspired by modern 21st.dev style and Vercel-like minimal product pages.

Navbar style:

```text
centered container
white or glassy surface
subtle border
soft shadow
rounded-xl
compact height
```

Desktop links:

```text
Home
About
For Organizers
For Companies
How It Works
```

Right actions:

```text
Sign In
Get Started
```

Mobile:

```text
Sheet menu
right side drawer
same navigation links
primary CTA
```

Important adjustments from 21st.dev reference:

```text
Remove theme toggle because Eventora uses light mode only.
Replace Acme brand with Eventora.
Do not use emoji.
Use English copy.
Use subtle border, not heavy shadow.
```

Suggested UI copy:

```text
Eventora
Home
About
For Organizers
For Companies
How It Works
Sign In
Get Started
```

---

## 11. Hero Section

### 11.1 Hero Concept

Hero uses animated switching text from the provided switch text reference.

Hero should communicate:

```text
Eventora turns sponsorship outreach into a structured digital workflow.
```

Recommended headline:

```text
Build sponsorship workflows for
[events]
[proposals]
[partnerships]
[organizers]
[companies]
```

Alternative headline:

```text
Connect events with the right sponsorship partners.
```

Hero subheadline:

```text
Eventora helps organizers manage proposals, apply to companies, track sponsorship status, and move partnerships forward in one clean platform.
```

Hero buttons:

```text
Get Started
See How It Works
```

### 11.2 Hero Visual

Hero visual should combine:

```text
animated switch text
grid pattern background
glassy gradient
floating sponsorship cards
animated organizer to company flow
dashboard preview frame
```

Hero should not use:

```text
3D illustration
emoji
cartoon mascot
neon glow
generic SaaS stock illustration
```

### 11.3 Hero Background

Use:

```text
light grid pattern
subtle radial blue glow
small moving gradient blur
white to light gray background
```

Possible Tailwind direction:

```tsx
<section className="relative overflow-hidden bg-[#F7F8FA]">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3E7ED_1px,transparent_1px),linear-gradient(to_bottom,#E3E7ED_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
  <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#2E86AB]/15 blur-3xl" />
</section>
```

### 11.4 Hero Floating Cards

Create 3 to 5 cards:

```text
Proposal Uploaded
Sponsor Match
Application Sent
Reviewed
Accepted
```

Use small card tilt only on hover:

```text
transform rotate-1 hover:-rotate-1
transition duration-200
```

Cards should feel like interface elements, not decorations.

---

## 12. Problem Section

Goal:

```text
Show the pain of manual sponsorship workflows.
```

Suggested headline:

```text
Sponsorship outreach is still scattered.
```

Problem cards:

```text
Proposal files spread across chats and emails
No clear application tracking
Companies receive unstructured requests
Organizers lose follow-up context
Admins cannot monitor platform activity
```

Design:

```text
5 cards in bento grid
white surface
thin border
small icon line only
no colored icon box
```

Motion:

```text
scroll reveal stagger
no heavy movement
```

---

## 13. Solution Section

Goal:

```text
Introduce Eventora as centralized sponsorship management platform.
```

Suggested headline:

```text
One platform for proposals, applications, and partnership decisions.
```

Solution points:

```text
Create events with proposal PDF
Find companies based on sponsorship preferences
Apply with custom cover letters
Track sponsorship status in real time
Let companies review requests in a clean inbox
Give admins full visibility of platform activity
```

Design:

```text
two-column layout
left copy
right mini workflow diagram
glassy card with flow lines
```

---

## 14. How It Works Section

Use 4 step process:

```text
1. Create an Event
2. Upload Proposal
3. Apply to Companies
4. Track and Continue Partnership
```

Visual:

```text
horizontal timeline on desktop
vertical timeline on mobile
thin line connector
small outlined number badge
```

Suggested copy:

```text
Create a structured event profile with audience, category, budget range, and required support.
Upload one main proposal and use it across multiple sponsorship applications.
Send customized cover letters to different companies.
Track every application from pending to reviewed, accepted, rejected, or cancelled.
```

Motion:

```text
line reveal on scroll
step cards fade in sequentially
```

---

## 15. Role Explanation Section

Explain 3 roles:

```text
Event Organizer
Company
Admin
```

Layout:

```text
3 cards
same height
outlined card
subtle hover lift
```

Event Organizer card:

```text
Create events, upload proposals, apply to sponsors, bookmark companies, and track sponsorship status.
```

Company card:

```text
Receive sponsorship requests, review proposals, accept or reject applications, and manage partnership history.
```

Admin card:

```text
Monitor platform activity, manage users, moderate events, and review sponsorship analytics.
```

---

## 16. Feature Highlights Section

Use bento grid.

Feature cards:

```text
Event and Proposal Management
Company Discovery
Custom Cover Letter
Sponsorship Tracking
Review Inbox for Companies
Admin Monitoring
Notifications
Pitching Schedule
```

Design rules:

```text
Use 2 large cards and 6 smaller cards.
Use grayscale surfaces with one blue accent.
No colorful icon grids.
Use line icons only.
```

---

## 17. Sponsorship Flow Section

This is one of the most important landing page sections.

Visual concept:

```text
Organizer card
Event card
Proposal card
Application card
Company card
Status pipeline
```

Flow:

```text
Organizer creates event
Proposal is uploaded
Application is sent to company
Company opens detail
Status becomes reviewed
Company accepts or rejects
Organizer receives notification
```

Animation:

```text
subtle moving line
status badges changing in sequence
floating application cards
```

Do not make it like a blockchain/network animation.

Suggested UI copy:

```text
From proposal to partnership, every step stays visible.
```

---

## 18. Dashboard Preview Section

Show product credibility.

Use a large dashboard preview frame inspired by the management page reference.

Preview should show:

```text
Admin analytics cards
Sponsorship table
Status distribution
Recent activity
```

Visual:

```text
large rounded frame
thin border
inner screenshot-like dashboard mockup
gradient fade bottom
shadow soft
```

Important:

```text
Do not use external screenshots from shadcn demo in final product.
Create Eventora-specific mock dashboard UI.
```

Dashboard preview labels:

```text
Total Organizers
Total Companies
Active Events
Sponsorship Requests
Accepted Partnerships
Recent Activity
```

---

## 19. Testimonials Section

Use testimonial marquee reference, but adapt to Eventora.

Original reference uses vertical marquee cards. Adapt it into an Eventora testimonial wall.

Important adaptation rules:

```text
Remove country flags.
Remove emoji.
Use fictional names and roles.
Use clean testimonial cards.
Use grayscale profile placeholders or initials.
Reduce strong 3D perspective.
Use subtle diagonal marquee only if it remains elegant.
Pause on hover.
```

Recommended testimonial data:

```text
Alya Prameswari
Event Organizer Lead
"Eventora helps us keep sponsorship outreach organized from proposal upload to company response."

Raka Firmansyah
Partnership Officer
"We can review incoming proposals faster because every request has consistent structure."

Nadia Rahman
Student Organization Manager
"Tracking application status makes our team more confident during sponsor outreach."

Dimas Putra
Community Program Lead
"The platform gives our team one place to manage events, sponsors, and follow-ups."

Clara Wijaya
Corporate Relations
"Eventora reduces scattered conversations and helps companies focus on the most relevant proposals."
```

Design:

```text
white cards
thin border
initial avatar
small role text
body text max 3 lines
```

Motion:

```text
vertical marquee
duration 40s to 60s
pause on hover
gradient overlay top and bottom
```

---

## 20. Partner Slider Section

Use logo slider reference adapted for Eventora.

Purpose:

```text
Show dummy trusted partners or sponsorship categories.
```

Since this is UAS, do not use real company logos without permission. Use neutral dummy partner names or text-based logo marks.

Suggested partner names:

```text
Nusantara Tech
Mitra Event
EduGrow
PartnerHub
CampusLink
Bright Media
Urban Venue
DigitalPath
```

Design:

```text
monochrome wordmarks
auto-scroll
low contrast
fade edge overlay
```

Heading:

```text
Built for organizers and companies that move events forward.
```

---

## 21. CTA Section

CTA should be simple and strong.

Headline:

```text
Ready to manage sponsorships with clarity?
```

Description:

```text
Create events, send sponsorship applications, and track every response from one organized workspace.
```

Buttons:

```text
Get Started
Sign In
```

Visual:

```text
glassy gradient card
center aligned
no illustration
no emoji
```

---

## 22. Footer

Footer links:

```text
Product
How It Works
For Organizers
For Companies
About
Sign In
Get Started
```

Footer copy:

```text
Eventora is a digital sponsorship management platform for organizers, companies, and admins.
```

Footer style:

```text
minimal
gray background
thin top border
small text
```

---

## 23. Dashboard Design Overview

Dashboard has 3 role interfaces:

```text
Admin
Event Organizer
Company
```

Layout decision:

```text
Admin uses sidebar.
Event Organizer and Company use top navbar.
```

Reason:

```text
Admin needs control center navigation.
Organizer and Company need workflow navigation with simpler mental model.
```

---

## 24. Admin Dashboard Layout

Admin style:

```text
Vercel and GitHub inspired sidebar
enterprise control center
light mode
compact but spacious
```

Admin route:

```text
/admin/dashboard
/admin/users
/admin/companies
/admin/organizations
/admin/events
/admin/sponsorships
/admin/reports
/admin/account
```

Layout:

```text
left sidebar fixed
top page header
main content area
cards and data tables
```

Sidebar visual:

```text
white background
border-right
small brand lockup
nav items with active left indicator
muted icons
no colorful icon backgrounds
```

Admin dashboard components:

```text
stat cards
sponsorship status cards
recent activity table
popular category chart
monthly sponsorship chart
user management table
event moderation table
sponsorship monitoring table
```

Admin dashboard should feel:

```text
control center
structured
analytical
not playful
```

Animations:

```text
page fade only
card hover subtle
sidebar active transition
chart load fade
```

No parallax in dashboard.

---

## 25. Event Organizer Dashboard Layout

Organizer style:

```text
top navbar
action-oriented
event management and sponsorship tracker
friendly startup
```

Organizer routes:

```text
/dashboard
/events
/events/create
/companies
/companies/:id
/sponsorships
/sponsorships/:id
/bookmarks
/notifications
/account
```

Top nav items:

```text
Home
Events
Apply Sponsor
Tracking
Bookmarks
Notifications
Account
```

Dashboard contents:

```text
profile completion prompt if profile incomplete
accepted pending rejected stats
latest sponsorship tracking
quick action cards
accepted sponsorship contact panel
empty state if no event
```

Important rule:

```text
After login, if profile is incomplete, keep user on profile completion page until required fields are complete.
```

Organizer priority pages:

```text
Apply Sponsor
Company Detail
Sponsorship Tracking
```

---

## 26. Company Dashboard Layout

Company style:

```text
top navbar
proposal inbox
review pipeline
partnership decision board
```

Company routes:

```text
/dashboard
/sponsorships
/sponsorships/:id
/history
/notifications
/account
```

Top nav items:

```text
Home
Requests
History
Notifications
Account
```

Dashboard contents:

```text
request inbox
pending reviewed accepted rejected stats
filter bar
request cards or data table
empty inbox state
```

Priority pages:

```text
Dashboard Request Masuk
Detail Request
History
```

Since UI copy must be English, labels should be:

```text
Incoming Requests
Request Detail
History
```

---

## 27. Detail Sponsorship Page

Style:

```text
inbox email style
```

Layout:

```text
left column: request metadata and status
center: proposal and cover letter
right column: action panel
```

For Company:

```text
Accept
Reject
Response Message
Download Proposal
View Organizer Contact
```

For Organizer:

```text
Status Timeline
Company Contact if accepted
Cover Letter Sent
Response Message
Cancel if pending or reviewed
```

Status timeline:

```text
Pending
Reviewed
Accepted or Rejected
Cancelled if cancelled
```

Design:

```text
minimal
document-like
clean borders
no heavy icon boxes
```

---

## 28. Form Design

Form style:

```text
minimal clean
enterprise form
clear validation
```

Form rules:

```text
label above input
required marker as text, not icon
inline error below field
helper text only if useful
button disabled during submit
loading spinner optional but subtle
```

Input style:

```text
h-10 or h-11
rounded-lg
border #E3E7ED
focus ring soft blue
background white
```

File upload style:

```text
dropzone card
PDF requirements shown as text
uploaded file name visible
replace file button
```

No emoji in file upload.

---

## 29. Data Table Design

Use modern data table for:

```text
admin users
admin companies
admin organizations
admin events
admin sponsorship monitoring
company history
organizer tracking
```

Table style:

```text
white surface
rounded-xl container
border
sticky header if needed
row hover bg #F7F8FA
compact cell padding
status badge outlined
filter bar above table
```

Table actions:

```text
View
Edit
Ban
Delete
Moderate
```

Do not use too many action buttons per row. Use dropdown action when more than 2 actions.

---

## 30. Status Badge System

Use outlined badge style.

| Status | Label | Style |
|---|---|---|
| pending | Pending | gray border, gray text |
| reviewed | Reviewed | blue border, blue text |
| accepted | Accepted | green border, green text |
| rejected | Rejected | red border, red text |
| cancelled | Cancelled | orange border, orange text |
| draft | Draft | gray border |
| active | Active | green border |
| archived | Archived | slate border |
| hidden | Hidden | amber border |
| removed | Removed | red border |

Badge rules:

```text
No emoji.
No large colored background.
Use small dot only if needed.
Keep outlined style.
```

---

## 31. Empty State Design

No gimmicks.

### Organizer no event

Title:

```text
No events created yet.
```

Description:

```text
Create your first event and upload a proposal to start applying for sponsorship.
```

CTA:

```text
Create Event
```

### Company no request

Title:

```text
No sponsorship requests yet.
```

Description:

```text
Incoming applications from organizers will appear here once they apply to your company.
```

CTA:

```text
Complete Company Profile
```

### Admin empty analytics

Title:

```text
No activity yet.
```

Description:

```text
Platform activity will appear after users create events and submit sponsorship applications.
```

---

## 32. Notification Design

Notifications are in-app only.

Navbar:

```text
notification bell icon without emoji
small unread dot or count
```

Notification page:

```text
list layout
title
message
time
read unread state
mark as read
mark all as read
```

Unread style:

```text
left border blue
light blue background
```

Read style:

```text
white background
muted text
```

---

## 33. Responsive Rules

Landing page:

```text
mobile first
hero text max width
cards stack vertically
dashboard preview horizontal scroll or scaled down
testimonial marquee height reduced
navbar switches to sheet menu
```

Dashboard:

```text
admin sidebar collapses or becomes drawer on mobile
top navbar becomes compact menu on mobile
tables become card list on mobile
filters stack vertically
actions remain easy to tap
```

Breakpoints:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 34. Frontend Architecture Light

Use:

```text
React + Vite
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
React Router DOM
Axios
TanStack Query
Zustand for auth state
```

Recommended folder structure:

```text
frontend/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── companies/
│   │   ├── events/
│   │   ├── sponsorships/
│   │   ├── bookmarks/
│   │   ├── notifications/
│   │   ├── pitching/
│   │   └── admin/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   └── utils/
├── .env.example
└── package.json
```

API base URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Auth state:

```text
Zustand stores token, user, role, and profile completion state.
```

Data fetching:

```text
TanStack Query handles server state, loading, error, refetch, and cache invalidation.
```

Axios:

```text
single axios instance
attach Bearer token automatically
handle 401 redirect to login
handle 403 redirect to /403
```

---

## 35. 21st.dev Component Integration Rules

Provided reference components include:

```text
main management page
testimoni user
switch text hero
slider
```

They should be adapted, not copied blindly.

### 35.1 Main Management Page Reference

Use for:

```text
landing navbar
hero dashboard preview frame
animated entry motion
mobile sheet menu
```

Adaptation:

```text
rename Acme to Eventora
remove dark mode toggle
replace generic dashboard screenshot with Eventora dashboard mockup
use English copy
use light mode only
convert motion import if necessary
```

### 35.2 Switch Text Hero Reference

Use for:

```text
hero animated changing keyword
```

Adaptation keywords:

```text
events
proposals
partnerships
organizers
companies
```

Replace generic copy with Eventora copy.

### 35.3 Testimonial Reference

Use for:

```text
testimonial vertical marquee
```

Adaptation:

```text
remove flags and emoji
use Eventora-specific testimonial copy
reduce 3D intensity
use initials instead of random faces if needed
pause on hover
```

### 35.4 Slider Reference

Use for:

```text
partner logo or partner wordmark slider
```

Adaptation:

```text
replace tech logos with dummy sponsor partner names
use monochrome wordmarks
use auto-scroll
avoid real company logos unless assets are provided
```

### 35.5 Dependency Notes

Likely dependencies:

```bash
npm install framer-motion lucide-react
npm install @tanstack/react-query zustand axios react-router-dom
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-avatar
npm install embla-carousel-react embla-carousel-auto-scroll
```

If using shadcn/ui:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label separator sheet avatar dialog dropdown-menu badge table textarea select
```

---

## 36. Anti AI Slop Rules

Strictly avoid:

```text
neon colors
garish gradients
too many colorful icon boxes
emoji anywhere in UI
3D illustrations
cartoon characters
overly rounded cards
too much border on every component
dashboard with empty gimmicks
random AI-generated icons
unnecessary glassmorphism everywhere
generic SaaS copy
oversized spacing with no content
fake AI assistant widgets
overanimated dashboard
```

Design must be:

```text
clean
structured
premium
enterprise-ready
fast
calm
functional
```

---

## 37. UI Copy Rules

Language:

```text
Full English
```

Tone:

```text
Friendly startup
Professional
Clear
Action-oriented
```

Examples:

```text
Get Started
See How It Works
Create Event
Apply Sponsorship
Incoming Requests
Review Proposal
Accept Request
Reject Request
Track Sponsorship
Complete Profile
No sponsorship requests yet.
Your sponsorship application has been accepted.
```

Do not mix Indonesian and English in UI labels.

Exception:

```text
Database values may still use Indonesian labels if backend seed data already does.
Frontend display labels should be English where possible.
```

---

## 38. Page Priority

### P0 Frontend Pages

Must be created first:

```text
Landing Page
Login
Register
Profile Completion
Organizer Dashboard
Create Event
Company List
Company Detail
Apply Sponsorship
Sponsorship Tracking
Company Dashboard
Sponsorship Detail
Admin Dashboard
Admin Sponsorship Monitoring
```

### P1 Frontend Pages

Create after P0:

```text
Bookmarks
Notifications
Company History
Admin Users
Admin Companies
Admin Organizations
Admin Events
```

### P2 Frontend Pages

Create if time allows:

```text
Pitching Session
Reports Export UI
About
For Organizers
For Companies
Advanced dashboard chart polish
```

---

## 39. Development Notes for AI Coding Agent

When implementing frontend:

```text
Read docs/PRD.md, docs/FLOW.md, and docs/DESIGN.md before coding.
Use TypeScript.
Use shadcn/ui components where possible.
Do not create random visual style outside DESIGN.md.
Do not introduce dark mode.
Do not use emoji.
Do not use 3D assets.
Do not use neon gradients.
Keep dashboard animation minimal.
Use Eventora-specific mock data where backend is not ready.
Consume backend API through VITE_API_BASE_URL.
```

Implementation order:

```text
1. Setup React Vite TypeScript
2. Setup Tailwind and shadcn/ui
3. Setup routing
4. Setup Axios, TanStack Query, Zustand auth
5. Build public landing page
6. Build auth pages
7. Build profile completion
8. Build shared layout components
9. Build organizer flow
10. Build company flow
11. Build admin flow
12. Integrate animations
13. Polish responsive
14. Connect all API states
```

---

## 40. Final Design Quality Checklist

Landing page:

```text
Hero has switch text animation.
Hero has grid background and glassy gradient.
Floating cards feel like real UI elements.
Problem and solution sections are clear.
How It Works explains real sponsorship flow.
Testimonials use adapted marquee without emoji.
Partner slider uses dummy monochrome names.
CTA is strong and clean.
No 3D illustrations.
No neon.
```

Dashboard:

```text
Admin uses sidebar.
Organizer and company use top navbar.
Tables are modern and readable.
Forms are clean.
Badges are outlined.
Empty states are useful.
Profile completion is enforced.
Animations are subtle.
No unnecessary gimmicks.
```

Technical:

```text
TypeScript is used.
API base URL is in env.
Axios handles token.
TanStack Query handles server state.
Zustand handles auth state.
shadcn/ui is used consistently.
Framer Motion is used for premium motion.
Components are reusable.
Responsive layout works.
```

---

## 41. Design Summary

Eventora should look like a modern sponsorship marketplace with enterprise-grade workflow management.

Landing page should sell the product.

Dashboard should help users complete tasks quickly.

Final visual direction:

```text
white black gray minimalism
blue silver accents
glassy gradient only where useful
Vercel and GitHub inspired admin layout
clean product showcase landing page
premium but restrained motion
no emoji
no 3D
no AI-generic visual noise
```
