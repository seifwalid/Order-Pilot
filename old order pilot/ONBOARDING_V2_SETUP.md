# OrderPilot Onboarding V2 Setup Guide

## Installation Requirements

The new Apple-style onboarding requires additional dependencies:

```bash
npm install framer-motion clsx tailwind-merge
```

## Environment Variables

Add to your `.env.local`:

```bash
# Enable the new onboarding experience
NEXT_PUBLIC_ONBOARDING_V2_ENABLED=true
```

## Feature Flag Control

The onboarding V2 can be controlled via environment variable:

- `NEXT_PUBLIC_ONBOARDING_V2_ENABLED=true` - Use new Apple-style onboarding
- `NEXT_PUBLIC_ONBOARDING_V2_ENABLED=false` - Use legacy onboarding (default)

## Rollout Strategy

1. **Development**: Set `NEXT_PUBLIC_ONBOARDING_V2_ENABLED=true` for testing
2. **Staging**: Test with both versions using feature flag
3. **Production**: Gradual rollout by enabling for specific users/restaurants
4. **Full Release**: Set to `true` for all users

## Graceful Fallback

- If V2 is disabled, users are automatically redirected to legacy onboarding
- All existing backend APIs and data contracts are preserved
- No breaking changes to existing functionality

## Files Added

### Core Components
- `src/app/(onboarding)/onboarding/v2/page.tsx` - Main entry with feature flag
- `src/app/(onboarding)/onboarding/v2/client.tsx` - Client wrapper
- `src/app/(onboarding)/onboarding/v2/_components/Wizard.tsx` - Main orchestrator

### Step Components
- `StepWelcome.tsx` - Welcome screen
- `StepIdentity.tsx` - Restaurant identity setup
- `StepConnections.tsx` - System integrations
- `StepTeam.tsx` - Staff invitations
- `StepMenu.tsx` - Menu template selection
- `StepTheme.tsx` - Theme and appearance
- `StepVoice.tsx` - Voice ordering setup
- `StepSummary.tsx` - Final review and launch

### Supporting Components
- `PreviewCard.tsx` - Live preview component
- `Waveform.tsx` - Voice animation component

### State Management
- `_state/useWizardState.ts` - Wizard state with server sync

### Styling
- `_styles/gradients.css` - Apple-style gradients and animations

### Utilities
- `lib/onboarding/api.ts` - API adapter for existing endpoints
- `lib/theme/accent.ts` - Accent color system
- `lib/a11y/reducedMotion.ts` - Accessibility utilities
- `lib/utils/cn.ts` - Enhanced class merging

## Backend Compatibility

✅ **Zero backend changes required**
- All existing API endpoints are preserved
- Database schema remains unchanged
- RLS policies work as-is
- Staff invitation system unchanged

## Testing

1. Enable V2: `NEXT_PUBLIC_ONBOARDING_V2_ENABLED=true`
2. Visit `/onboarding` - should redirect to `/onboarding/v2`
3. Complete the flow - should save to existing database tables
4. Disable V2: `NEXT_PUBLIC_ONBOARDING_V2_ENABLED=false`
5. Visit `/onboarding` - should show legacy version

## Accessibility

- Respects `prefers-reduced-motion`
- Full keyboard navigation
- Screen reader announcements
- WCAG contrast validation
- Focus management

## Performance

- Code splitting for V2 components
- Optimistic UI updates
- Local state caching with localStorage
- Graceful error handling and recovery
