# MindSteps — Refactored Architecture
## Smart Journaling System · Atomic Design + Separation of Concerns

---

## Directory Structure

```
├── types/
│   └── index.ts                     # ✅ Single source of truth for ALL types
│
├── lib/
│   ├── services/
│   │   ├── journal.service.ts       # ✅ Pure HTTP layer — FastAPI/backend calls
│   │   └── analysis.service.ts      # ✅ Pure business logic — routing auth vs demo
│   └── utils/
│       └── date.ts                  # ✅ Pure date formatters
│
├── contexts/
│   ├── AuthContext.tsx              # ✅ Global — Auth state only
│   └── TierContext.tsx              # ✅ Global — Subscription tier only
│
├── features/
│   ├── journal/
│   │   └── hooks/
│   │       └── useJournalFlow.ts    # ✅ Feature hook — 4-step flow state + analysis trigger
│   ├── entries/
│   │   └── hooks/
│   │       └── useEntries.ts        # ✅ Feature hook — pagination, search, delete
│   ├── emotions/
│   │   └── hooks/
│   │       └── useEmotionStats.ts   # ✅ Feature hook — Plutchik stats
│   └── insights/
│       └── hooks/
│           └── useInsights.ts       # ✅ Feature hook — Maslow deep insights
│
├── components/
│   ├── atoms/                       # Indivisible UI primitives
│   │   ├── ActionBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── TierPill.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   │
│   ├── molecules/                   # Compositions of atoms
│   │   ├── QuickActionButton.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── NavigationControls.tsx
│   │   ├── JournalTextarea.tsx      # ✅ NEW — eliminates SurfaceStep/InnerStep/MeaningStep duplication
│   │   ├── InsightCard.tsx          # ✅ NEW — extracted from SeedInsightStep
│   │   └── index.ts
│   │
│   ├── organisms/                   # Feature-complete UI sections
│   │   ├── SurfaceStep.tsx          # Composes JournalTextarea
│   │   ├── InnerReactionStep.tsx    # Composes JournalTextarea
│   │   ├── MeaningStep.tsx          # Composes JournalTextarea
│   │   ├── SeedInsightStep.tsx      # Composes InsightCard[]
│   │   ├── ThoughtFlow.tsx          # ✅ Wires all steps + useJournalFlow hook
│   │   ├── ActionGrid.tsx           # ✅ Free + Pro action grids
│   │   ├── MainHeader.tsx
│   │   └── index.ts
│   │
│   └── templates/                   # Page-level layouts
│       ├── DashboardLayout.tsx      # Sidebar + mobile nav + drawer
│       ├── HomePageTemplate.tsx     # Home/Demo page, manages view state
│       └── index.ts
│
└── app/
    ├── dashboard/
    │   ├── layout.tsx               # Auth guard + DashboardLayout wrapper
    │   ├── home/page.tsx            # Server Component → HomePageTemplate
    │   ├── entries/page.tsx         # Client Component → useEntries
    │   ├── emotions/page.tsx        # Client Component → useEmotionStats
    │   └── insights/page.tsx        # Client Component → useInsights + tier gate
    └── marketing/
        └── demo/page.tsx            # Server Component → HomePageTemplate (demoMode)
```

---

## Separation of Concerns — Layer Responsibilities

| Layer | Location | Allowed to... | NOT allowed to... |
|---|---|---|---|
| **Service** | `lib/services/` | Make HTTP calls, throw errors, return typed data | Import React, use hooks, touch DOM |
| **Feature Hook** | `features/*/hooks/` | Use React state/effects, call services, derive UI state | Render JSX, import components |
| **Global Context** | `contexts/` | Provide auth/tier state app-wide | Contain business logic, API calls |
| **Atom** | `components/atoms/` | Style, display a single concept | Use hooks, call APIs, read context |
| **Molecule** | `components/molecules/` | Compose atoms, accept all state via props | Read context, contain business logic |
| **Organism** | `components/organisms/` | Read context (tier/auth), compose molecules, wire to feature hooks | Directly call services, manage global state |
| **Template** | `components/templates/` | Manage layout, navigation UI state (drawer open etc.) | Contain domain business logic |
| **Page** | `app/**/page.tsx` | Use `Suspense`, pass props to templates | Contain any UI logic |

---

## Key Architectural Decisions

### 1. Types Centralization
**Before:** Types scattered across `types/types.ts`, `lib/permissions.ts`, `data/constants.ts`, local component files.
**After:** Single `types/index.ts` — import everything from `@/types`.

### 2. Service Layer Extraction
**Before:** `lib/api/journalBackend.ts` and `lib/api/analyze.ts` mixed HTTP logic with routing decisions.
**After:**
- `journal.service.ts` — pure HTTP, one function per endpoint
- `analysis.service.ts` — orchestration logic (auth vs demo routing)

### 3. `useJournalFlow` replaces `useThoughtFlow`
**Before:** Hook imported from `components/thought/hooks/` (wrong layer — hooks inside component folder).
**After:** `features/journal/hooks/useJournalFlow.ts` — correct feature-scoped location. Identical API, cleaner import path.

### 4. `JournalTextarea` molecule eliminates duplication
**Before:** `SurfaceStep`, `InnerReactionStep`, `MeaningStep` each contained identical textarea + heading markup.
**After:** All three now compose `JournalTextarea` molecule — one place to change styling.

### 5. `InsightCard` extracted from `SeedInsightStep`
**Before:** Card markup inline in `SeedInsightStep` organism.
**After:** `InsightCard` molecule — reusable anywhere insights appear.

### 6. Deleted folders
- `components/shared/` — merged into `atoms/` and `molecules/`
- `components/thought/` — split into `features/journal/` (hooks) + `components/organisms/` (UI)
- `components/pages/` — moved to `components/templates/`

### 7. Server vs Client boundary
| Component | Directive | Reason |
|---|---|---|
| `app/**/page.tsx` | None (Server) | Data shell, delegates to Client templates |
| `DashboardLayout` | `'use client'` | `usePathname`, `useState` for drawer |
| `ThoughtFlow` | `'use client'` | `useEffect` to sync initialAction |
| `SeedInsightStep` | `'use client'` | `useEffect` to trigger analysis on mount |
| Atoms/Molecules | None where possible | Maximum Server Component benefit |

### 8. Context usage rule
Only **organisms** and above may read from context (`useAuth`, `useThoughtContext`).
Atoms and molecules receive all data via props — they are fully portable and testable.

---

## Data Flow Diagram

```
Page (Server Component)
  └── Template (Client, manages view state)
        └── Organism (reads context if needed, wires hook)
              ├── useFeatureHook()
              │     └── service.ts (pure HTTP)
              └── Molecule (pure props)
                    └── Atom (pure props)
```

---

## Removed / Deprecated Files

These files from the original codebase are **replaced** and should be deleted:

```
components/shared/             → split into atoms/ molecules/
components/thought/            → split into features/journal/ + organisms/
components/pages/              → moved to templates/
components/thought/hooks/      → moved to features/journal/hooks/
lib/api/journalBackend.ts      → replaced by lib/services/journal.service.ts
lib/api/analyze.ts             → replaced by lib/services/analysis.service.ts
lib/hooks/useEmotionStats.ts   → moved to features/emotions/hooks/
features/entries/hooks/        → updated, same location but delegates to service
types/types.ts                 → replaced by types/index.ts
```
