# Implementation Guide - Getting Started

This guide provides step-by-step instructions to implement the scalable architecture.

## 🚀 Phase 1: Project Structure Setup (Week 1)

### Step 1: Create Folder Structure

```bash
mkdir -p src/{components/{ui,features,layout},features/{auth,cards,profile,vault},services/{api,storage,analytics},store/slices,hooks,utils,types,config,lib}
mkdir -p __tests__/{components,features,utils}
```

### Step 2: Install Essential Dependencies

```bash
# State Management (choose one)
npm install zustand
# OR
npm install @reduxjs/toolkit react-redux

# API Client
npm install axios

# Environment Variables
npm install react-native-dotenv

# Testing
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest

# Code Quality
npm install --save-dev husky lint-staged prettier
```

### Step 3: Set Up Environment Variables

Create `.env` file:
```env
EXPO_PUBLIC_API_URL=https://api.dropstcg.com
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_FEATURE_FLAGS_ENABLED=true
```

Create `src/config/env.ts`:
```typescript
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENV || 'development',
  FEATURE_FLAGS_ENABLED: process.env.EXPO_PUBLIC_FEATURE_FLAGS_ENABLED === 'true',
} as const;
```

### Step 4: Create Constants File

`src/utils/constants.ts`:
```typescript
export const COLORS = {
  primary: '#0a0019',
  secondary: '#12042b',
  accent: '#40ffdc',
  text: '#ffffff',
  textSecondary: '#ffffff',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  CARDS: '/cards',
  PROFILE: '/profile',
  VAULT: '/vault',
} as const;
```

---

## 🗄️ Phase 2: State Management Setup (Week 1-2)

### Option A: Zustand (Recommended for simplicity)

1. Install Zustand:
```bash
npm install zustand
```

2. Create auth store (`src/store/slices/authSlice.ts`):
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

3. Install AsyncStorage:
```bash
npm install @react-native-async-storage/async-storage
```

### Option B: Redux Toolkit (For complex state)

1. Install Redux Toolkit:
```bash
npm install @reduxjs/toolkit react-redux
```

2. Create store (`src/store/index.ts`):
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🌐 Phase 3: API Service Layer (Week 2)

### Step 1: Create API Client

`src/services/api/client.ts`:
```typescript
import axios from 'axios';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/store/slices/authSlice';

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 2: Create API Services

`src/services/api/cards.ts`:
```typescript
import apiClient from './client';

export interface Card {
  id: string;
  name: string;
  image: string;
  rarity: string;
}

export const cardsApi = {
  getAll: () => apiClient.get<Card[]>('/cards'),
  getById: (id: string) => apiClient.get<Card>(`/cards/${id}`),
  create: (data: Partial<Card>) => apiClient.post<Card>('/cards', data),
  update: (id: string, data: Partial<Card>) => apiClient.put<Card>(`/cards/${id}`, data),
  delete: (id: string) => apiClient.delete(`/cards/${id}`),
};
```

---

## 🚩 Phase 4: Feature Flags (Week 2-3)

### Step 1: Create Feature Flag Service

`src/services/featureFlags.ts`:
```typescript
import { ENV } from '@/config/env';

export const FEATURE_FLAGS = {
  NEW_CARD_SYSTEM: 'new_card_system',
  PROFILE_V2: 'profile_v2',
  VAULT_ENHANCED: 'vault_enhanced',
} as const;

class FeatureFlagService {
  private flags: Record<string, boolean> = {};

  async initialize() {
    if (!ENV.FEATURE_FLAGS_ENABLED) {
      // All flags disabled in development
      return;
    }

    try {
      // TODO: Fetch from your backend or Firebase Remote Config
      const response = await fetch(`${ENV.API_URL}/feature-flags`);
      this.flags = await response.json();
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      // Default: all flags disabled
      this.flags = {};
    }
  }

  isEnabled(flagName: string): boolean {
    return this.flags[flagName] === true;
  }

  setFlag(flagName: string, enabled: boolean) {
    this.flags[flagName] = enabled;
  }
}

export const featureFlagService = new FeatureFlagService();
```

### Step 2: Create Feature Flag Hook

`src/hooks/useFeatureFlag.ts`:
```typescript
import { useState, useEffect } from 'react';
import { featureFlagService } from '@/services/featureFlags';

export const useFeatureFlag = (flagName: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFlag = async () => {
      await featureFlagService.initialize();
      setIsEnabled(featureFlagService.isEnabled(flagName));
      setIsLoading(false);
    };

    checkFlag();
  }, [flagName]);

  return { isEnabled, isLoading };
};
```

### Step 3: Use in Components

```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/services/featureFlags';

const MyComponent = () => {
  const { isEnabled: showNewCardSystem } = useFeatureFlag(FEATURE_FLAGS.NEW_CARD_SYSTEM);

  return (
    <View>
      {showNewCardSystem ? <NewCardSystem /> : <OldCardSystem />}
    </View>
  );
};
```

---

## 🧪 Phase 5: Testing Setup (Week 3)

### Step 1: Configure Jest

`jest.config.js`:
```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
```

### Step 2: Write Your First Test

`__tests__/components/TopNavbar.test.tsx`:
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TopNavbar from '@/components/layout/TopNavbar';

describe('TopNavbar', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<TopNavbar />);
    expect(getByTestId('logo')).toBeTruthy();
  });

  it('opens menu when burger icon is pressed', () => {
    const { getByTestId } = render(<TopNavbar />);
    const menuButton = getByTestId('menu-button');
    
    fireEvent.press(menuButton);
    
    expect(getByTestId('dropdown-menu')).toBeTruthy();
  });
});
```

---

## 🔧 Phase 6: Code Quality Tools (Week 3)

### Step 1: Set Up Husky

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
```

### Step 2: Configure lint-staged

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "pre-commit": "lint-staged"
  }
}
```

### Step 3: Update ESLint Config

`.eslintrc.json`:
```json
{
  "extends": [
    "expo",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [["@", "./src"]],
        "extensions": [".ts", ".tsx", ".js", ".jsx"]
      }
    }
  }
}
```

### Step 4: Configure TypeScript Paths

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 📦 Phase 7: Component Organization (Week 4)

### Move Components to New Structure

1. **UI Components** (`src/components/ui/`):
   - Button.tsx
   - Input.tsx
   - Card.tsx
   - Modal.tsx

2. **Layout Components** (`src/components/layout/`):
   - TopNavbar.tsx (move from app/components/)
   - BottomTabBar.tsx
   - Container.tsx

3. **Feature Components** (`src/components/features/`):
   - CardList.tsx
   - ProfileHeader.tsx
   - VaultGrid.tsx

### Example: Create Reusable Button Component

`src/components/ui/Button.tsx`:
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '@/utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : COLORS.accent} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: COLORS.accent,
  },
});
```

---

## 🎯 Quick Start Checklist

- [ ] Create folder structure
- [ ] Install dependencies (Zustand/Redux, Axios, etc.)
- [ ] Set up environment variables
- [ ] Create constants file
- [ ] Set up state management
- [ ] Create API service layer
- [ ] Implement feature flags
- [ ] Set up testing
- [ ] Configure code quality tools (Husky, ESLint, Prettier)
- [ ] Reorganize components
- [ ] Update imports to use `@/` alias

---

## 📚 Next Steps

1. **Read ARCHITECTURE.md** for detailed explanations
2. **Start with Phase 1** - Set up project structure
3. **Implement incrementally** - Don't try to do everything at once
4. **Test as you go** - Write tests for new features
5. **Document decisions** - Keep notes on why you made certain choices

---

**Need Help?** Refer to ARCHITECTURE.md for detailed explanations of each concept.

