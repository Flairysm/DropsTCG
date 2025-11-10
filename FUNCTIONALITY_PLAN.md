# DropsTCG Functionality Implementation Plan

## Overview
This plan outlines the implementation of core functionality to transform the app from a UI prototype to a fully functional application.

---

## Phase 1: Foundation & Infrastructure (Week 1-2)

### 1.1 State Management Setup
**Goal:** Centralize app state and user data

**Tasks:**
- [ ] Choose state management solution (React Context API or Zustand recommended)
- [ ] Create `contexts/` directory structure
- [ ] Implement `AuthContext` for user authentication state
- [ ] Implement `UserContext` for user profile, token balance, cards
- [ ] Implement `AppContext` for global app state (notifications, loading states)
- [ ] Replace all hardcoded user data with context

**Files to Create:**
- `app/contexts/AuthContext.tsx`
- `app/contexts/UserContext.tsx`
- `app/contexts/AppContext.tsx`
- `app/contexts/index.tsx` (combine providers)

**Dependencies:**
- Consider adding `zustand` or use React Context API (already available)

---

### 1.2 API Service Layer
**Goal:** Create reusable API communication layer

**Tasks:**
- [ ] Create `services/` directory
- [ ] Set up API base configuration (base URL, headers, interceptors)
- [ ] Create `api.ts` with axios/fetch wrapper
- [ ] Implement error handling middleware
- [ ] Add request/response interceptors for auth tokens
- [ ] Create API endpoint constants

**Files to Create:**
- `app/services/api.ts` (base API client)
- `app/services/auth.service.ts`
- `app/services/user.service.ts`
- `app/services/raffle.service.ts`
- `app/services/pack.service.ts`
- `app/services/card.service.ts`
- `app/services/payment.service.ts`
- `app/services/order.service.ts`
- `app/config/api.config.ts`

**Dependencies:**
```bash
npm install axios
# or use native fetch with proper error handling
```

---

### 1.3 Authentication System
**Goal:** Implement user authentication flow

**Tasks:**
- [ ] Create login page (`app/login.tsx`)
- [ ] Create signup/register page (`app/register.tsx`)
- [ ] Implement login API integration
- [ ] Implement token storage (AsyncStorage/SecureStore)
- [ ] Add protected route wrapper
- [ ] Implement auto-login on app start
- [ ] Add logout functionality (clear tokens, reset state)
- [ ] Update `_layout.tsx` to check auth state

**Files to Create:**
- `app/login.tsx`
- `app/register.tsx`
- `app/components/ProtectedRoute.tsx`
- `app/utils/storage.ts` (token management)

**Dependencies:**
```bash
npm install @react-native-async-storage/async-storage
# or
expo install expo-secure-store
```

---

## Phase 2: Core Features - User & Profile (Week 2-3)

### 2.1 User Profile Management
**Goal:** Connect profile pages to backend

**Tasks:**
- [ ] Implement profile data fetching from API
- [ ] Connect Profile Setting page to update API
- [ ] Add profile picture upload functionality
- [ ] Implement change password API
- [ ] Add two-factor authentication setup
- [ ] Add form validation
- [ ] Add loading states and error handling

**API Endpoints Needed:**
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/user/avatar`
- `PUT /api/user/password`
- `POST /api/user/2fa/enable`
- `POST /api/user/2fa/disable`

**Files to Update:**
- `app/(tabs)/profile.tsx`
- `app/profile-setting.tsx`
- `app/change-password.tsx` (create)
- `app/two-factor-auth.tsx` (create)

---

### 2.2 Token Balance & Reload
**Goal:** Implement token purchase system

**Tasks:**
- [ ] Connect token balance to user context
- [ ] Implement payment gateway integration (Stripe/Razorpay/etc.)
- [ ] Add payment confirmation flow
- [ ] Update token balance after successful purchase
- [ ] Add transaction history
- [ ] Handle payment failures gracefully
- [ ] Add loading states during payment

**API Endpoints Needed:**
- `GET /api/user/tokens/balance`
- `POST /api/payments/create-intent`
- `POST /api/payments/confirm`
- `GET /api/payments/transactions`

**Files to Update:**
- `app/(tabs)/reload.tsx`
- `app/services/payment.service.ts`

**Dependencies:**
```bash
# Choose payment provider
npm install @stripe/stripe-react-native
# or
npm install react-native-razorpay
```

---

## Phase 3: Core Features - Purchases & Raffles (Week 3-4)

### 3.1 Raffle System
**Goal:** Make raffles fully functional

**Tasks:**
- [ ] Implement raffle listing API
- [ ] Connect raffle details page to API
- [ ] Implement slot purchase API
- [ ] Update raffle progress in real-time
- [ ] Add raffle winner selection logic (backend)
- [ ] Show user's raffle participations
- [ ] Add raffle history
- [ ] Handle raffle completion states

**API Endpoints Needed:**
- `GET /api/raffles` (list all)
- `GET /api/raffles/:id` (details)
- `POST /api/raffles/:id/purchase-slots`
- `GET /api/user/raffles` (user's participations)
- `GET /api/raffles/:id/winners`

**Files to Update:**
- `app/components/RaffleEventsSection.tsx`
- `app/raffle-details.tsx`
- `app/raffles.tsx`

---

### 3.2 Pack Purchases (Gem Drops, Mystery Boxes, Booster Packs)
**Goal:** Implement pack opening system

**Tasks:**
- [ ] Connect pack listings to API
- [ ] Implement pack purchase API
- [ ] Create pack opening animation/flow
- [ ] Implement card reveal system
- [ ] Add cards to user's vault after opening
- [ ] Update pack availability
- [ ] Handle purchase errors

**API Endpoints Needed:**
- `GET /api/packs/gem-drops`
- `GET /api/packs/mystery-boxes`
- `GET /api/packs/booster-packs`
- `POST /api/packs/:type/:id/purchase`
- `POST /api/packs/:type/:id/open`
- `GET /api/packs/:type/:id/prize-pool`

**Files to Update:**
- `app/components/GemDropsSection.tsx`
- `app/components/MysteryBoxesSection.tsx`
- `app/components/VirtualBoosterPacksSection.tsx`
- `app/pack-info.tsx`
- `app/gem-drops.tsx`
- `app/mystery-boxes.tsx`
- `app/virtual-booster-packs.tsx`

**New Files:**
- `app/components/PackOpeningAnimation.tsx` (card reveal animation)

---

## Phase 4: Core Features - Vault & Cards (Week 4-5)

### 4.1 Vault Management
**Goal:** Connect vault to real card data

**Tasks:**
- [ ] Connect vault to user's card collection API
- [ ] Implement card filtering and search API
- [ ] Add card refund API
- [ ] Implement card shipment API
- [ ] Update card selection state
- [ ] Add bulk operations (select all, refund all, ship all)
- [ ] Show card images from API
- [ ] Add card details modal

**API Endpoints Needed:**
- `GET /api/user/cards` (vault)
- `GET /api/user/cards?tier=SSS&category=Pokemon`
- `POST /api/user/cards/refund` (bulk)
- `POST /api/user/cards/ship` (bulk)
- `GET /api/user/cards/:id`

**Files to Update:**
- `app/(tabs)/vault.tsx`

---

### 4.2 Order Shipments
**Goal:** Track and manage shipments

**Tasks:**
- [ ] Connect to order/shipment API
- [ ] Display real shipment data
- [ ] Add shipment status updates
- [ ] Show tracking information
- [ ] Add shipment history
- [ ] Handle shipment status changes

**API Endpoints Needed:**
- `GET /api/user/orders`
- `GET /api/user/orders/:id`
- `GET /api/user/shipments`
- `GET /api/user/shipments/:id/tracking`

**Files to Update:**
- `app/order-shipments.tsx`

---

## Phase 5: Additional Features (Week 5-6)

### 5.1 Address Management
**Goal:** Full CRUD for addresses

**Tasks:**
- [ ] Connect address CRUD to API
- [ ] Add address validation
- [ ] Set default address API
- [ ] Handle address deletion
- [ ] Add address selection for shipping

**API Endpoints Needed:**
- `GET /api/user/addresses`
- `POST /api/user/addresses`
- `PUT /api/user/addresses/:id`
- `DELETE /api/user/addresses/:id`
- `PUT /api/user/addresses/:id/set-default`

**Files to Update:**
- `app/address.tsx`

---

### 5.2 Feedback & Support
**Goal:** Enable user feedback and support

**Tasks:**
- [ ] Connect feedback submission to API
- [ ] Add feedback confirmation
- [ ] Implement support ticket system (optional)
- [ ] Add FAQ data from API
- [ ] Connect help page options

**API Endpoints Needed:**
- `POST /api/feedback`
- `GET /api/faq`
- `POST /api/support/tickets` (optional)

**Files to Update:**
- `app/feedback.tsx`
- `app/faq.tsx`
- `app/help.tsx`

---

### 5.3 Notifications System
**Goal:** Real-time notifications

**Tasks:**
- [ ] Connect notifications to API
- [ ] Implement push notifications (Expo Notifications)
- [ ] Add notification badge count
- [ ] Mark notifications as read
- [ ] Add notification categories

**API Endpoints Needed:**
- `GET /api/user/notifications`
- `PUT /api/user/notifications/:id/read`
- `PUT /api/user/notifications/read-all`
- `POST /api/user/notifications/register-device`

**Files to Update:**
- `app/components/NotificationsPanel.tsx`
- `app/components/TopNavbar.tsx`

**Dependencies:**
```bash
expo install expo-notifications
```

---

## Phase 6: Admin Features (Week 6-7)

### 6.1 Admin Dashboard
**Goal:** Complete admin functionality

**Tasks:**
- [ ] Connect admin stats to API
- [ ] Implement raffle management
- [ ] Add card management
- [ ] User management system
- [ ] Admin settings
- [ ] Add admin authentication check

**API Endpoints Needed:**
- `GET /api/admin/stats`
- `GET /api/admin/raffles`
- `POST /api/admin/raffles`
- `PUT /api/admin/raffles/:id`
- `GET /api/admin/users`
- `GET /api/admin/cards`

**Files to Update:**
- `app/admin.tsx`

---

## Phase 7: Error Handling & UX (Week 7)

### 7.1 Error Handling
**Goal:** Graceful error handling throughout app

**Tasks:**
- [ ] Create error boundary component
- [ ] Add error toast/alert system
- [ ] Handle network errors
- [ ] Handle API errors (400, 401, 403, 404, 500)
- [ ] Add retry mechanisms
- [ ] Show user-friendly error messages

**Files to Create:**
- `app/components/ErrorBoundary.tsx`
- `app/components/ErrorToast.tsx`
- `app/utils/errorHandler.ts`

---

### 7.2 Loading States
**Goal:** Better loading UX

**Tasks:**
- [ ] Add loading spinners to all async operations
- [ ] Implement skeleton loaders
- [ ] Add pull-to-refresh
- [ ] Show loading states during purchases
- [ ] Add optimistic updates where appropriate

**Files to Create:**
- `app/components/LoadingSpinner.tsx`
- `app/components/SkeletonLoader.tsx`

---

### 7.3 Form Validation
**Goal:** Validate all user inputs

**Tasks:**
- [ ] Add form validation library (react-hook-form + yup)
- [ ] Validate all forms (login, register, profile, address, etc.)
- [ ] Show validation errors
- [ ] Prevent invalid submissions

**Dependencies:**
```bash
npm install react-hook-form yup @hookform/resolvers
```

---

## Phase 8: Testing & Optimization (Week 8)

### 8.1 Testing
**Tasks:**
- [ ] Add unit tests for services
- [ ] Add integration tests for critical flows
- [ ] Test error scenarios
- [ ] Test on different devices/screens
- [ ] Performance testing

---

### 8.2 Optimization
**Tasks:**
- [ ] Optimize API calls (caching, debouncing)
- [ ] Add image optimization
- [ ] Implement pagination for lists
- [ ] Add offline support (optional)
- [ ] Optimize bundle size

---

## Technical Decisions Needed

### State Management
**Recommendation:** Start with React Context API (no extra dependencies), migrate to Zustand if complexity grows.

### API Client
**Recommendation:** Use `axios` for better error handling and interceptors.

### Payment Gateway
**Options:**
- Stripe (international)
- Razorpay (India/SEA)
- iPay88 (Malaysia)
- Decide based on target market

### Image Storage
**Options:**
- AWS S3
- Cloudinary
- Supabase Storage
- Firebase Storage

### Backend Stack
**Need to decide:**
- Node.js/Express
- Python/Django/FastAPI
- Supabase (Firebase alternative)
- Custom backend

---

## Priority Order

1. **Phase 1** - Foundation (Critical - blocks everything else)
2. **Phase 2** - User & Profile (High - core user experience)
3. **Phase 3** - Purchases & Raffles (High - core business logic)
4. **Phase 4** - Vault & Cards (High - core feature)
5. **Phase 5** - Additional Features (Medium)
6. **Phase 6** - Admin (Medium - if needed)
7. **Phase 7** - Error Handling & UX (High - user experience)
8. **Phase 8** - Testing & Optimization (Ongoing)

---

## Estimated Timeline

- **Phase 1-2:** 2-3 weeks
- **Phase 3-4:** 2-3 weeks
- **Phase 5-6:** 1-2 weeks
- **Phase 7-8:** 1-2 weeks

**Total: 6-10 weeks** (depending on backend availability and complexity)

---

## Next Steps

1. **Decide on backend stack** - This affects API structure
2. **Set up development environment** - API endpoints, mock data
3. **Start with Phase 1.1** - State management (can be done in parallel with backend)
4. **Create API documentation** - Document all endpoints needed
5. **Set up error tracking** - Sentry or similar

---

## Notes

- All phases can be worked on in parallel if backend is ready
- Use mock data/API during development if backend isn't ready
- Consider using MSW (Mock Service Worker) for API mocking
- Keep UI/UX consistent while adding functionality
- Test on both iOS and Android throughout development

