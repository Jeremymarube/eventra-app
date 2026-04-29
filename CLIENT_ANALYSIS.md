# Eventra Client Application - Comprehensive Analysis

**Application Type:** Next.js 16 (App Router) with React 19  
**Styling:** Tailwind CSS 4, Inline Styles (CSS-in-JS)  
**Authentication:** JWT token via localStorage  
**External Services:** Supabase (optional), Stripe (payment processing)

---

## 1. COMPLETE PAGE STRUCTURE WITH ROUTES

| Route | File | Auth Required | Component Type | Purpose |
|-------|------|---------------|----------------|---------|
| `/` | `src/app/page.js` | ❌ | Landing page | Home with hero section, navigation to browse/categories |
| `/login` | `src/app/login/page.jsx` | ❌ | Auth form | User login with email/password |
| `/register` | `src/app/register/page.jsx` | ❌ | Auth form | User registration |
| `/about` | `src/app/about/page.jsx` | ❌ | Static page | About Eventra platform |
| `/browse` | `src/app/browse/page.jsx` | ❌ | Event listing | Browse all events with hardcoded data |
| `/categories` | `src/app/categories/page.jsx` | ❌ | Category grid | 10 event categories with descriptions |
| `/event/[id]` | `src/app/event/[id]/page.jsx` | ❌ | Dynamic detail | Event details, save, book functionality |
| `/profile` | `src/app/profile/page.js` | ✅ | User profile | User profile (mock data currently) |
| `/tickets` | `src/app/tickets/page.jsx` | ✅ | Booking list | User's upcoming & past event bookings |
| `/saved` | `src/app/saved/page.jsx` | ❌ | Wishlist | User's saved events (hardcoded mock data) |
| `/settings` | `src/app/settings/page.jsx` | ✅ | Account settings | Notification preferences, privacy settings |
| `/settings/preferences` | `src/app/settings/preferences/page.jsx` | ✅ | Preferences | Display mode, language, notification channels |
| `/host` | `src/app/host/page.jsx` | ✅ | Dashboard | Host event dashboard (draft/published) |
| `/host/new` | `src/app/host/new/page.jsx` | ✅ | Event form | Create new event with calendar management |
| `/host/edit/[id]` | `src/app/host/edit/[id]/page.jsx` | ✅ | Event form | Edit existing event details |
| `/host/event/[id]/attendees` | `src/app/host/event/[id]/attendees/page.jsx` | ✅ | Attendee list | View attendees, check-in, export CSV |
| `/host/event/[id]/analytics` | `src/app/host/event/[id]/analytics/page.jsx` | ✅ | Analytics | Event booking & revenue analytics |
| `/admin-analytics` | `src/app/admin-analytics/page.jsx` | ❌ | Dashboard | Platform-wide analytics (mock data) |
| `/events` | `src/app/events/page.js` | ❌ | Event list | Events listing page (uses Tailwind) |
| `/events/id` | `src/app/events/id/page.js` | ❌ | Event detail | Individual event view (mock data) |

---

## 2. API ENDPOINTS CALLED FROM FRONTEND

### Authentication Endpoints
```
POST   /api/login              - Email/password login
POST   /api/register           - User registration
```

### Events Endpoints
```
GET    /api/events             - List all published events
GET    /api/events/{eventId}   - Get event details
POST   /api/events             - Create new event (in host/new)
PUT    /api/events/{eventId}   - Update event details & publish status
```

### Bookings/Tickets Endpoints
```
GET    /api/bookings           - Get user's bookings/tickets
POST   /api/bookings           - Create booking for an event
POST   /api/bookings/{id}/cancel       - Cancel a booking
POST   /api/bookings/{id}/checkin      - Check-in attendee at event
```

### Saved Events Endpoints
```
GET    /api/saved-events       - Get user's saved events
POST   /api/saved-events       - Save an event
DELETE /api/saved-events/{eventId} - Unsave an event
```

### Host/Admin Endpoints
```
GET    /api/host/events        - Get host's events (draft + published)
GET    /api/host/events/{id}/attendees      - Get event attendees
GET    /api/host/events/{id}/analytics      - Get event analytics
```

### Calendar Endpoints
```
GET    /api/calendars          - Get user's calendars
POST   /api/calendars          - Create new calendar
```

### Image Upload Endpoint
```
POST   /api/upload/image       - Upload event cover image
```

---

## 3. DATA FETCHING PATTERNS & HOOKS

### useEffect Hook Patterns

#### Pattern 1: Protected Route with Token Check
```javascript
// Used in: tickets, host, host/edit, settings
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login?redirect=/current-page");
  }
  fetchData();
}, []);
```

#### Pattern 2: Fetch on Component Mount
```javascript
// Used in: event detail, host dashboard
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  fetch(`/api/endpoint`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(setData)
    .finally(() => setLoading(false));
}, [dependencyId]);
```

#### Pattern 3: Event ID Dependency
```javascript
// Used in: event/[id], host/edit/[id]
const { id } = useParams();
useEffect(() => {
  if (!id) return;
  fetchEvent(id);
}, [id]);
```

### Authentication Pattern
- **Location:** `localStorage`
- **Token Storage:** `localStorage.getItem("token")`
- **User Data:** `localStorage.getItem("user")` (JSON stringified)
- **Logout:** Clear localStorage items
- **Hook:** `useAuth()` hook (Supabase fallback available)

### State Management
- **Approach:** React hooks (useState, useEffect) - No Redux/Zustand
- **Local State:** Component-level with `useState`
- **Persistent State:** localStorage for user, settings, preferences
- **Session State:** Temporary form data in component state

---

## 4. COMPONENTS & THEIR USAGE

| Component | Path | Purpose | Used In |
|-----------|------|---------|---------|
| `Header` | `src/components/Header.jsx` | Navigation bar (hides when logged in) | Root layout |
| `Footer` | `src/components/Footer.jsx` | Footer with links | Root layout |
| `Navbar` | `src/components/Navbar.jsx` | Alternative navbar (commented out) | Not used |
| `EventCard` | `src/components/EventCard.jsx` | Event preview card | browse, events lists |
| `SignedInHome` | `src/components/SignedInHome.jsx` | Logged-in dashboard | Intended for home after login |
| `MapView` | `src/components/MapView.jsx` | Map component | Imported but not used |
| `NotificationBell` | `src/components/NotificationBell.jsx` | Notification icon | Not used |
| `ShareButton` | `src/components/ShareButton.jsx` | Share functionality | Not used |
| `Sidebar` | `src/components/Sidebar.jsx` | Navigation sidebar | Not used |
| `LayoutWrapper` | `src/components/LayoutWrapper.jsx` | Layout wrapper | Not used |
| `Button` | `src/components/ui/Button.jsx` | Reusable button | Not used |

**Layout System:**
- `src/app/layout.js` - Root layout with globals.css
- Layout provider pattern not implemented

---

## 5. EXTERNAL INTEGRATIONS & DATA SOURCES

### Supabase Integration
**File:** `src/integrations/supabase/client.js`
```javascript
- Reads: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Feature: Authentication via supabase.auth.getSession()
- Status: Optional (warns if not configured)
- Usage: useAuth hook falls back to localStorage if Supabase unavailable
```

### Payment Processing
**Library:** Stripe (@stripe/react-stripe-js v6.2.0, @stripe/stripe-js v9.3.1)
- Installed but not integrated in any page currently
- Ready for checkout flow implementation

### Image Sources
- **Unsplash CDN:** All event preview images use Unsplash URLs
- **Local Storage:** `/public/images/` folder (fallback images for categories)

### External Libraries
- **framer-motion** v12.38.0 - Animations (not currently used)
- **lucide-react** v1.8.0 - Icons (used in components)
- **axios** v1.15.1 - HTTP client (installed, not used; fetch API preferred)
- **clsx** v2.1.1 - Conditional classNames
- **tailwind-merge** v3.5.0 - Tailwind class merging
- **class-variance-authority** v0.7.1 - Utility class variants

---

## 6. UTILITY FUNCTIONS & HELPERS

### Format Library (`src/lib/format.js`)
```javascript
CATEGORIES = [music, food, tech, art, wellness, nightlife, sports, business, community, other]
CATEGORY_LABELS = { key: "Display Name" mapping }
```

### Utils Library (`src/lib/utils.js`)
```javascript
cn(...inputs) - Utility to merge clsx + tailwindMerge
```

### Analytics Library (`src/lib/analytics.js`)
- Empty file (ready for implementation)

---

## 7. FORM FIELDS & VALIDATION

### Login/Register Forms
**Fields:**
- Email (type: email, required)
- Password (type: password, required)
- Name (register only, required)

**State Management:**
- Form state in component-level useState
- Error/Loading states
- No form library (plain React)

### Event Creation/Edit Form
**Fields:**
- title, description, category
- location_name, location (coordinates)
- starts_at, ends_at (datetime)
- capacity, price_cents, currency
- cover_image_url
- status (draft/published), visibility (public/private)
- calendar_id (optional)

**Advanced Features:**
- Image upload with validation (file type, size)
- Calendar selection/creation
- Dynamic field updates

---

## 8. STATE MANAGEMENT SUMMARY

### Local Component State (useState)
- Form inputs (login, event creation, preferences)
- Loading/Error states
- UI toggles (tabs, modals, dropdowns)
- Lists (events, tickets, attendees)

### Persistent State (localStorage)
- `token` - JWT authentication token
- `user` - User object (JSON stringified)
- `userSettings` - Notification/privacy settings
- `userPreferences` - Display mode, language, notification channels

### Session State
- Page-level loading/error states
- Form submission states
- Modal/dialog states

### No Global State Management
- Redux ❌
- Zustand ❌
- Context API ❌
- TanStack Query ❌

---

## 9. DATA DEPENDENCIES MAP

```
Homepage (/)
├── useAuth hook → localStorage
└── Navigation → Link to Browse/Categories

Browse (/browse)
├── Hardcoded allEvents array
└── EventCard component → Links to /event/[id]

Event Detail (/event/[id])
├── GET /api/events/{id}
├── GET /api/saved-events (if logged in)
├── Save button → POST/DELETE /api/saved-events
├── Book button → POST /api/bookings
└── Redirect to /tickets after booking

Tickets (/tickets)
├── useAuth (protected)
├── GET /api/bookings
├── POST /api/bookings/{id}/cancel
└── Tabs: Upcoming/Past

Host Dashboard (/host)
├── useAuth (protected)
├── GET /api/host/events
└── PUT /api/events/{id} (publish/unpublish)

Create Event (/host/new)
├── useAuth (protected)
├── GET /api/calendars
├── POST /api/calendars (new calendar)
├── POST /api/upload/image (cover)
└── POST /api/events (create event)

Event Analytics (/host/event/[id]/analytics)
├── GET /api/events/{id}
└── GET /api/host/events/{id}/analytics

Settings (/settings)
├── useAuth (protected)
└── localStorage (userSettings)

Preferences (/settings/preferences)
└── localStorage (userPreferences)
```

---

## 10. CRITICAL OBSERVATIONS

### ✅ Strengths
1. Clean separation of pages using Next.js App Router
2. Protected routes with token validation
3. Consistent error handling patterns
4. Responsive design with inline styles and Tailwind CSS
5. Form validation for critical fields (images, dates)

### ⚠️ Areas for Improvement
1. **No Global State Management** - Consider Zustand for auth/user state
2. **No Request Caching** - Add TanStack Query for data caching
3. **Missing Error Boundaries** - No error boundary components
4. **Form Handling** - No validation library (consider react-hook-form + zod)
5. **File Uploads** - Image upload lacks progress tracking
6. **API Constants** - Hardcoded API routes should be centralized
7. **Type Safety** - No TypeScript (consider migration)
8. **Environment Variables** - Should use .env.local for API_BASE_URL
9. **Unused Dependencies** - framer-motion, axios installed but not used
10. **Unused Components** - MapView, NotificationBell, ShareButton, Sidebar

### 🔄 Data Flow Architecture
```
User Action → Component Event Handler → fetch() API Call
    ↓
API Response → setData()/Error → Component Re-render
    ↓
Persist to localStorage (tokens, preferences)
```

### 📱 Responsive Design
- Inline styles with `clamp()` for fluid typography
- CSS Grid with `auto-fit` and `minmax()`
- Mobile-first approach (flex direction column by default)
- Padding uses viewport units: `max(16px, 3vw)`

---

## 11. AUTHENTICATION FLOW

```
┌─────────────────────────────────────────┐
│  User Visits Protected Route            │
├─────────────────────────────────────────┤
│ 1. Check localStorage.getItem("token")  │
├─────────────────────────────────────────┤
│ 2a. If NO token → Redirect to /login    │
│    (with ?redirect= query param)        │
├─────────────────────────────────────────┤
│ 2b. If YES token → Show content         │
│     Include token in API requests:      │
│     headers: { Authorization: `Bearer ${token}` }
├─────────────────────────────────────────┤
│ 3. On logout → Clear token & user       │
│    localStorage.removeItem("token")     │
│    Redirect to home                     │
└─────────────────────────────────────────┘
```

---

## 12. KEY FILES SUMMARY

| File | Purpose | Status |
|------|---------|--------|
| `src/app/layout.js` | Root layout, globals | ✅ Active |
| `src/integrations/supabase/client.js` | Auth provider | ⚠️ Optional |
| `src/hooks/use-auth.jsx` | Auth hook | ✅ Active |
| `src/lib/utils.js` | CSS utility (cn) | ✅ Active |
| `src/lib/format.js` | Category mappings | ✅ Active |
| `src/components/Header.jsx` | Nav header | ✅ Active |
| `src/components/Footer.jsx` | Footer | ✅ Active |
| `src/components/EventCard.jsx` | Event preview | ✅ Active |
| `src/components/SignedInHome.jsx` | Logged-in view | ❌ Unused |
| `src/components/Navbar.jsx` | Alt navbar | ❌ Commented |

---

## 13. RECOMMENDED NEXT STEPS

1. **Centralize API Endpoints** → Create `lib/api.ts` with typed endpoints
2. **Add TanStack Query** → Replace manual fetch with useQuery/useMutation
3. **Implement Error Boundaries** → Catch component render errors
4. **Add Form Library** → Use react-hook-form for complex forms
5. **Migrate to TypeScript** → Add type safety to all pages/components
6. **Setup Environment Variables** → Move API URLs to .env.local
7. **Clean Unused Components** → Remove unused MapView, NotificationBell, etc.
8. **Add Loading Skeletons** → Better UX during data fetching
9. **Implement Proper Logging** → Error tracking (Sentry)
10. **Add Integration Tests** → Test data fetching and navigation flows
