# DropsTCG Folder Structure

## Organized File Structure

### Root Level
```
app/
├── _layout.tsx                    # Root layout
├── globals.css                     # Global styles
├── admin.tsx                       # Admin page (stays at root)
└── (tabs)/                         # Tab navigation
    ├── _layout.tsx
    ├── index.tsx                   # Home
    ├── play.tsx                    # Play tab
    ├── reload.tsx                  # Reload tab
    ├── vault.tsx                   # Vault tab
    └── profile.tsx                 # Profile tab
```

### Profile Pages (`app/profile/`)
All profile-related pages are now organized in the `profile/` folder:

- `order-shipments.tsx` → `/profile/order-shipments`
- `raffles.tsx` → `/profile/raffles`
- `address.tsx` → `/profile/address`
- `faq.tsx` → `/profile/faq`
- `feedback.tsx` → `/profile/feedback`
- `profile-setting.tsx` → `/profile/profile-setting`
- `help.tsx` → `/profile/help`
- `privacy.tsx` → `/profile/privacy`
- `terms.tsx` → `/profile/terms`
- `logout.tsx` → `/profile/logout`

### Pack Pages (`app/packs/`)
All pack and purchase-related pages are now organized in the `packs/` folder:

- `pack-info.tsx` → `/packs/pack-info`
- `gem-drops.tsx` → `/packs/gem-drops`
- `mystery-boxes.tsx` → `/packs/mystery-boxes`
- `virtual-booster-packs.tsx` → `/packs/virtual-booster-packs`
- `raffle-details.tsx` → `/packs/raffle-details`

### Components (`app/components/`)
All reusable components remain in the `components/` folder:

- `TopNavbar.tsx`
- `FeaturedSection.tsx`
- `RaffleEventsSection.tsx`
- `RecentPullsSection.tsx`
- `GemDropsSection.tsx`
- `MysteryBoxesSection.tsx`
- `VirtualBoosterPacksSection.tsx`
- `MinigamesSection.tsx`
- `WelcomeSection.tsx`
- `NotificationsPanel.tsx`
- And more...

## Route Mapping

### Profile Routes
| Old Route | New Route |
|-----------|-----------|
| `/order-shipments` | `/profile/order-shipments` |
| `/raffles` | `/profile/raffles` |
| `/address` | `/profile/address` |
| `/faq` | `/profile/faq` |
| `/feedback` | `/profile/feedback` |
| `/profile-setting` | `/profile/profile-setting` |
| `/help` | `/profile/help` |
| `/privacy` | `/profile/privacy` |
| `/terms` | `/profile/terms` |
| `/logout` | `/profile/logout` |

### Pack Routes
| Old Route | New Route |
|-----------|-----------|
| `/pack-info` | `/packs/pack-info` |
| `/gem-drops` | `/packs/gem-drops` |
| `/mystery-boxes` | `/packs/mystery-boxes` |
| `/virtual-booster-packs` | `/packs/virtual-booster-packs` |
| `/raffle-details` | `/packs/raffle-details` |

## Benefits of This Structure

1. **Better Organization**: Related pages are grouped together
2. **Easier Navigation**: Clear folder structure makes it easy to find files
3. **Scalability**: Easy to add new pages to appropriate folders
4. **Maintainability**: Related functionality is co-located
5. **Clean Root**: Root directory is less cluttered

## Updated Files

All route references have been updated in:
- `app/(tabs)/profile.tsx` - Profile menu routes
- `app/components/GemDropsSection.tsx` - Pack info route
- `app/components/MysteryBoxesSection.tsx` - Pack info route
- `app/components/VirtualBoosterPacksSection.tsx` - Pack info route
- `app/components/RaffleEventsSection.tsx` - Raffle details route
- `app/profile/raffles.tsx` - Raffle details route
- `app/profile/help.tsx` - FAQ route
- `app/components/QuickPlaySection.tsx` - Mystery boxes route

## Notes

- Expo Router automatically handles folder-based routing
- All routes are working with the new structure
- No breaking changes to functionality
- All linter checks pass

