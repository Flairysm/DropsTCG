# Code Cleanup Report

## Unused Components (Can be deleted)

### 1. `app/components/AppIntroductionSection.tsx`
- **Status:** ❌ Not imported or used anywhere
- **Size:** ~162 lines
- **Action:** DELETE - This component is not referenced in any file

### 2. `app/components/QuickPlaySection.tsx`
- **Status:** ❌ Not imported or used anywhere
- **Size:** ~185 lines
- **Action:** DELETE - This component was removed from the home page and is not used

### 3. `app/components/FlickeringParticles.tsx`
- **Status:** ❌ Not imported or used anywhere
- **Size:** ~242 lines
- **Action:** DELETE - Particle effects were removed from the app

---

## Redundant Code Patterns

### 1. Duplicate Header Styles
**Issue:** The same header style pattern is repeated across multiple pages:
- `header`, `backButton`, `headerTitle`, `headerRight` styles
- Found in: `admin.tsx`, `pack-info.tsx`, `raffle-details.tsx`, and all profile pages

**Recommendation:** Create a reusable `PageHeader` component

**Files affected:**
- `app/admin.tsx`
- `app/packs/pack-info.tsx`
- `app/packs/raffle-details.tsx`
- `app/packs/gem-drops.tsx`
- `app/packs/mystery-boxes.tsx`
- `app/packs/virtual-booster-packs.tsx`
- `app/profile/*.tsx` (10 files)

**Estimated savings:** ~200-300 lines of duplicate code

---

### 2. Duplicate Modal Styles
**Issue:** Purchase confirmation modals have identical styles across:
- `pack-info.tsx`
- `gem-drops.tsx`
- `mystery-boxes.tsx`
- `virtual-booster-packs.tsx`
- `raffle-details.tsx`

**Recommendation:** Create a reusable `ConfirmModal` component

**Estimated savings:** ~100-150 lines

---

### 3. Token Conversion Comments
**Issue:** "RM1 = 20 tokens" comments scattered across files
- `app/(tabs)/reload.tsx` - Has `TOKENS_PER_RM` constant
- `app/components/RaffleEventsSection.tsx` - Has comment
- `app/packs/raffle-details.tsx` - Has display text

**Recommendation:** 
- Remove comments (user requested removal)
- Create a constants file for token conversion
- Use the constant everywhere instead of hardcoded values

**Files to clean:**
- Remove comment from `RaffleEventsSection.tsx` line 21
- Remove display text from `raffle-details.tsx` (if still present)

---

## Console.log Statements (29 found)

**Issue:** Debug console.log statements throughout the codebase

**Files with console.log:**
- `app/(tabs)/profile.tsx` (2)
- `app/(tabs)/vault.tsx` (4)
- `app/packs/pack-info.tsx` (2)
- `app/profile/logout.tsx` (2)
- `app/profile/help.tsx` (4)
- `app/profile/feedback.tsx` (2)
- `app/profile/profile-setting.tsx` (2)
- `app/packs/virtual-booster-packs.tsx` (2)
- `app/packs/mystery-boxes.tsx` (2)
- `app/packs/gem-drops.tsx` (2)
- `app/packs/raffle-details.tsx` (2)
- `app/(tabs)/reload.tsx` (2)
- `app/components/QuickPlaySection.tsx` (1)

**Recommendation:** 
- Remove all console.log statements
- Replace with proper error handling/logging when implementing API calls
- Or create a logger utility for development

---

## TODO Comments (29 found)

**Status:** ✅ These are expected - they mark future work
**Action:** Keep for now, will be addressed during functionality implementation

---

## Duplicate Section Header Styles

**Issue:** Section headers with vertical bar pattern repeated:
- `verticalBar`, `sectionTitle` styles
- Found in: `FeaturedSection`, `RaffleEventsSection`, `RecentPullsSection`, `GemDropsSection`, `MysteryBoxesSection`, `VirtualBoosterPacksSection`, `MinigamesSection`

**Recommendation:** Create a reusable `SectionHeader` component

**Estimated savings:** ~50-70 lines

---

## Summary

### Immediate Actions (High Priority)
1. ✅ **Delete unused components:**
   - `AppIntroductionSection.tsx`
   - `QuickPlaySection.tsx`
   - `FlickeringParticles.tsx`

2. ✅ **Remove console.log statements** (29 instances)

3. ✅ **Remove redundant token conversion comments**

### Future Improvements (Medium Priority)
4. ⚠️ **Create reusable components:**
   - `PageHeader` component (saves ~200-300 lines)
   - `ConfirmModal` component (saves ~100-150 lines)
   - `SectionHeader` component (saves ~50-70 lines)

5. ⚠️ **Create constants file:**
   - `app/constants/index.ts` for shared constants like `TOKENS_PER_RM`

### Total Potential Savings
- **Immediate:** ~589 lines (3 unused components)
- **With refactoring:** ~800-1000 lines of duplicate code

---

## Files to Delete

```
app/components/AppIntroductionSection.tsx
app/components/QuickPlaySection.tsx
app/components/FlickeringParticles.tsx
```

---

## Next Steps

1. Delete unused components
2. Remove all console.log statements
3. Clean up redundant comments
4. (Optional) Create reusable components to reduce duplication

