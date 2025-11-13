# Project Structure & Code Recommendations

## 📁 Current Structure Analysis

Your project follows a **feature-based architecture**, which is excellent! Here are recommendations to improve it further.

## ✅ What's Working Well

1. **Feature-based organization** - Each feature is self-contained
2. **Theme system** - Centralized styling with styled-components
3. **Consistent naming** - Clear file naming conventions
4. **Separation of concerns** - Screens, components, and infrastructure are separated

## 🎯 Recommended Improvements

### 1. **Extract Navigation Configuration**

**Current Issue:** Navigation logic is in `App.js` making it hard to maintain.

**Recommendation:** Create a dedicated navigation file.

```
src/
  navigation/
    AppNavigator.js          # Main navigation setup
    TabNavigator.js          # Bottom tab navigator
    navigation.config.js     # Tab colors, screen options
```

**Benefits:**
- Cleaner `App.js`
- Easier to add nested navigators
- Better testability

---

### 2. **Create Constants/Config Directory**

**Current Issue:** Magic numbers and hardcoded values scattered (e.g., `TOKENS_PER_RM = 20` in ReloadScreen).

**Recommendation:** Centralize constants.

```
src/
  constants/
    app.constants.js         # App-wide constants
    tokens.constants.js      # Token conversion rates
    navigation.constants.js  # Tab colors, routes
```

**Example:**
```javascript
// src/constants/tokens.constants.js
export const TOKEN_CONVERSION = {
  TOKENS_PER_RM: 20,
  QUICK_AMOUNTS: [10, 20, 50, 100, 200, 500],
};

// src/constants/navigation.constants.js
export const TAB_COLORS = {
  active: '#40ffdc',
  inactive: '#ffffff',
  barBg: '#12042b',
};
```

---

### 3. **Create Shared Components Directory**

**Current Issue:** Some components are feature-specific but could be reused.

**Recommendation:** Identify and extract reusable components.

```
src/
  components/
    shared/                   # Reusable across features
      Button/
        Button.js
        Button.styles.js
      Card/
        Card.js
        Card.styles.js
      Badge/
        Badge.js
      LoadingSpinner/
        LoadingSpinner.js
    layout/                   # Layout components
      TopNavbar.js
      BottomTabBar.js
    ui/                       # UI primitives
      Modal/
      Input/
      Select/
```

---

### 4. **Add Services/API Layer**

**Current Issue:** API calls will be scattered throughout components.

**Recommendation:** Create a services layer.

```
src/
  services/
    api/
      client.js              # API client setup (Axios/Fetch)
      endpoints.js           # API endpoints
    auth/
      auth.service.js        # Authentication logic
    cards/
      cards.service.js       # Card-related API calls
    tokens/
      tokens.service.js      # Token-related API calls
    notifications/
      notifications.service.js
```

---

### 5. **Add Context/State Management**

**Current Issue:** No global state management for auth, user data, etc.

**Recommendation:** Add React Context or state management.

```
src/
  contexts/
    AuthContext.js           # Authentication context
    UserContext.js           # User data context
    ThemeContext.js         # Theme switching (if needed)
  store/                     # If using Redux/Zustand
    slices/
      auth.slice.js
      user.slice.js
```

---

### 6. **Create Hooks Directory**

**Current Issue:** Custom hooks might be duplicated across features.

**Recommendation:** Extract reusable hooks.

```
src/
  hooks/
    useAuth.js               # Authentication hook
    useNotifications.js      # Notifications hook
    useTokens.js             # Token balance hook
    useDebounce.js           # Debounce utility hook
    useKeyboard.js           # Keyboard visibility hook
```

---

### 7. **Add Utils/Helpers**

**Current Issue:** Utility functions might be duplicated.

**Recommendation:** Create utility modules.

```
src/
  utils/
    formatters.js            # Number, date, currency formatters
    validators.js            # Input validation
    helpers.js               # General helper functions
    storage.js               # AsyncStorage wrapper
    errors.js                # Error handling utilities
```

**Example:**
```javascript
// src/utils/formatters.js
export const formatTokens = (amount) => {
  return amount.toLocaleString();
};

export const formatCurrency = (amount, currency = 'RM') => {
  return `${currency}${amount.toFixed(2)}`;
};
```

---

### 8. **Improve Component Organization**

**Current Issue:** Large screen files with many styled components.

**Recommendation:** Split styled components into separate files.

```
src/
  features/
    reload/
      screens/
        reload.screen.js
      components/
        QuickSelectButtons.js
        CustomAmountInput.js
        SummaryCard.js
      styles/
        reload.screen.styles.js
```

---

### 9. **Add Type Definitions (Optional)**

**Current Issue:** No type safety (considering you have TypeScript in devDependencies).

**Recommendation:** Either:
- Add `.d.ts` files for type definitions
- Or fully migrate to TypeScript

```
src/
  types/
    user.types.js            # User type definitions
    card.types.js            # Card type definitions
    navigation.types.js      # Navigation types
```

---

### 10. **Create Constants for Screen Names**

**Current Issue:** Screen names are hardcoded strings.

**Recommendation:** Use constants.

```javascript
// src/constants/routes.constants.js
export const ROUTES = {
  HOME: 'Home',
  RELOAD: 'Reload',
  PLAY: 'Play',
  VAULT: 'Vault',
  PROFILE: 'Profile',
};
```

---

## 🔧 Code Quality Improvements

### 1. **Extract Tab Configuration**

Move tab configuration to a separate file:

```javascript
// src/navigation/tab.config.js
export const tabConfig = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: { focused: 'home', unfocused: 'home-outline' },
    label: 'HOME',
  },
  // ... other tabs
];
```

### 2. **Create Reusable Styled Components**

Extract common patterns:

```javascript
// src/components/shared/Card/Card.js
export const Card = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;
```

### 3. **Add Error Boundaries**

```javascript
// src/components/ErrorBoundary.js
// Wrap your app to catch errors gracefully
```

### 4. **Add Loading States**

Create a consistent loading component:

```javascript
// src/components/shared/LoadingSpinner/LoadingSpinner.js
```

### 5. **Environment Configuration**

```javascript
// src/config/
  env.js                    # Environment variables
  api.config.js             # API base URLs
```

---

## 📦 Suggested Folder Structure

```
src/
  ├── components/
  │   ├── shared/           # Reusable components
  │   ├── layout/           # Layout components (TopNavbar, etc.)
  │   └── ui/               # UI primitives
  ├── features/
  │   ├── home/
  │   │   ├── components/
  │   │   ├── screens/
  │   │   └── hooks/        # Feature-specific hooks
  │   ├── reload/
  │   ├── play/
  │   ├── vault/
  │   └── profile/
  ├── navigation/
  │   ├── AppNavigator.js
  │   ├── TabNavigator.js
  │   └── navigation.config.js
  ├── services/
  │   ├── api/
  │   └── [feature-services]
  ├── contexts/
  │   ├── AuthContext.js
  │   └── UserContext.js
  ├── hooks/                # Shared hooks
  ├── utils/                # Utility functions
  ├── constants/            # App constants
  ├── types/                # Type definitions (if using TS)
  └── infrastructure/
      └── theme/
```

---

## 🚀 Performance Recommendations

1. **Memoize expensive computations** - Already using `useMemo` in VaultScreen ✅
2. **Lazy load screens** - Consider code splitting for large screens
3. **Optimize images** - Use optimized image formats
4. **Reduce re-renders** - Use `React.memo` for heavy components

---

## 📝 Next Steps Priority

1. **High Priority:**
   - Extract navigation to separate file
   - Create constants directory
   - Add services layer structure

2. **Medium Priority:**
   - Extract shared components
   - Add context for auth/user
   - Create utility functions

3. **Low Priority:**
   - Split large component files
   - Add TypeScript (if desired)
   - Performance optimizations

---

## 💡 Additional Tips

1. **Consistent File Naming:**
   - Use `.screen.js` for screens ✅ (already doing this)
   - Use `.component.js` for components
   - Use `.styles.js` for style files

2. **Index Files:**
   - Create `index.js` files for easier imports
   ```javascript
   // src/components/shared/index.js
   export { default as Button } from './Button/Button';
   export { default as Card } from './Card/Card';
   ```

3. **Documentation:**
   - Add JSDoc comments for complex functions
   - Document component props

4. **Testing Structure:**
   ```
   src/
     __tests__/
       components/
       features/
       utils/
   ```

