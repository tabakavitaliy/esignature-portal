# Frontend Engineer LLM Playbook (shadcn/ui Edition)

**Version**: 1.0 | **Last Updated**: 2026-01-30
**Target Audience**: Frontend engineers using LLM tools for React/Next.js development with shadcn/ui

---

## Quick Start Checklist

Before your first LLM-assisted coding session:
- [ ] Install Cursor IDE, use Ultra Subscription Plan
- [ ] Configure Tools: `Browser Automation`, `Github`
- [ ] Configure MCPs: `context7`, `github`, `jira`, `figma` (for design specs)
- [ ] Open Repository folder in Cursor
- [ ] Configure Project-level Cursor rules `.cursor/rules/universal.mdc` and `.cursor/rules/js.mdc`
- [ ] Ensure that the repository contains the folders `./docs/tickets` and `./docs/features`
- [ ] Ensure that the repository contains the catalogue index JSON files `./docs/tickets/tickets-index.json` and `./docs/features/features-index.json`.
 The file `./docs/features/features-index.json` keeps the index of the features with the brief descriptions (<100 symbols), status, progress (granular) and paths to the related files and tickets.
 The file `./docs/tickets/tickets-index.json` keeps the index of the tickets with the brief descriptions (<100 symbols), status, progress (granular) and paths to the related files and features.
- [ ] Initialize shadcn/ui: `npx shadcn@latest init`
- [ ] Read `README.md` for Project-specific installation and usage details

---

## 1. Tool & Model Selection

### Recommended Setup

| Tool                                  | Best For                                                   | Configuration                                             |
|---------------------------------------|------------------------------------------------------------|-----------------------------------------------------------|
| **Cursor + Claude Opus 4.5**          | Complex refactors, large component restructuring           | Plan mode, larger context, creating plan ticket           |
| **Cursor + GPT-5.2 Codex Extra High** | Refinement of Plan from Opus, complex issues investigation | Plan mode mode, refinement of plan ticket created by Opus |
| **Cursor + Claude Sonnet 4.5**        | Day-to-day coding, component creation, hook writing        | Plan+Agent modes, implementation                          |

### Model Selection Guide

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND MODEL SELECTION                                                                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                                        │
│  Simple Task?                                                                                                                                          │
│  (autocomplete, small fix, single component)                                                                                                           │
│      │                                                                                                                                                 │
│      ├── YES → Create plan ticket markdown file in `./docs/tickets` folder via Claude Sonnet 4.5 (plan mode), update the index                         │
│      │     and create/update/delete related feature(s) description markdown file(s)                                                                    │
│      │         └── → Implement plan ticket markdown file via Claude Sonnet 4.5 (plan mode),                                                            │
│      │                 update the related feature(s) in `./docs/features` files and in features index,                                                 │
│      │                 update the plan ticket markdown file in `./docs/tickets` folder and in tickets index to update the status/progress              │
│      │                                                                                                                                                 │
│      └── NO → Is it a large refactor/change (5+ files) or complex?                                                                                     │
│          │                                                                                                                                             │
│          ├── NO → Create plan ticket markdown file in `./docs/tickets` folder via Claude Sonnet 4.5 (plan mode), update the index                      │
│          │     and create/update/delete related feature(s) description markdown file(s)                                                                │
│          │         └── → Implement plan ticket markdown file via Claude Sonnet 4.5 (plan mode),                                                        │
│          │                 update the related feature(s) in `./docs/features` files and in features index,                                             │
│          │                 update the plan ticket markdown file in `./docs/tickets` folder and in tickets index to update the status/progress          │
│          └── YES → Create plan ticket markdown file in `./docs/tickets` folder via Claude Opus 4.5 (plan mode), update the index                       │
│               └── → Refine/extend/fix plan ticket markdown file via GPT-5.2 Codex Extra High in plan mode                                              │
│                        (for GPT always restrict the scope and explicitely require to not start the implementation,                                     │
│                        otherwise it will do unexpected), update the index                                                                              │
│                   └── → Refine/extend plan ticket markdown file                                                                                        │
│                            and create/update/delete related feature(s) description markdown file(s)                                                    │
│                            in `./docs/features` folder via Claude Sonnet 4.5 (plan mode), update the index                                             │
│                                └── → Implement plan ticket markdown file via Claude Sonnet 4.5 (plan mode),                                            │
│                                    update the related feature(s) in `./docs/features` files and in features index,                                     │
│                                    update the plan ticket markdown file in `./docs/tickets` folder and in tickets index to update the status/progress  │
│                                                                                                                                                        │
│  Uncertain about approach?                                                                                                                             │
│       → Use GPT-5.2 Codex Extra High in plan mode as second opinion (watch for hallucinations,                                                         │
│                        for GPT always restrict the scope and explicitely require to not start the implementation,                                      │
│                        otherwise it will do unexpected)                                                                                                │
│                                                                                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### MCPs for Frontend Work

**Essential:**
- `context7` - Up-to-date React/Next.js/TanStack Query/Tailwind docs, register for free to get token
- `figma` - Extract design specs and assets
- `github` - PR reviews, issue tracking, code search
- `jira` - Pull user story details

**Note:** shadcn/ui documentation is available at https://ui.shadcn.com - use `context7` or direct web fetch for latest docs.

### Ticket Catalogue Protocol (MANDATORY)

For ALL tasks (features, bugs, refactors):

1. **CHECK FIRST**: Read `./docs/tickets/tickets-index.json` for existing/related tickets
2. **FOUND?** → Update existing ticket → Resume work
3. **NOT FOUND?** → Create new ticket entry → Create detailed file in `docs/tickets/`
4. **DURING WORK**: Update progress, log issues, document plan changes
5. **ON COMPLETION**: Update status to "completed", update statistics

---

## 2. Project Organization Rules

### Mandatory Architecture Compliance

**Before ANY frontend code change**, verify:

```typescript
// ✅ CORRECT: Next.js with static export only
// next.config.js
const nextConfig = {
  output: 'export',  // MANDATORY: SSG + CSR only
  // NO server-side features allowed
};

// ✅ CORRECT: Data fetching via TanStack Query
const { data } = useQuery({
  queryKey: ['agreements'],
  queryFn: () => api.get('/api/agreements'),
});

// ❌ WRONG: useEffect for data fetching
useEffect(() => {
  fetch('/api/agreements').then(setAgreements);
}, []);

// ❌ WRONG: Next.js API routes
// pages/api/agreements.ts - NOT ALLOWED

// ❌ WRONG: Server-side rendering
export async function getServerSideProps() { } // NOT ALLOWED
```

### File Structure (Mandatory)

```
docs/
├── features/               # Features catalogue
│   ├── features-index.json # Features index
│   └── {feature}.md        # Feature description
├── tickets/                # Tickets (task tracking)
│   ├── tickets-index.json  # Tickets index
│   └── {ticket}.md         # Ticket description (detailed task files)
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (includes ThemeProvider, fonts)
│   ├── globals.css         # Global styles + Tailwind directives
│   ├── not-found.tsx       # Root Not Found page
│   ├── page.tsx            # Index page to redirect to Default locale
│   └── [locale]/           # Locale root
│       ├── layout.tsx      # Locale Folder Layout
│       ├── not-found.tsx   # Not Found Page
│       ├── page.tsx        # Locale Index Page (e.g., dashboard)
│       └── {page}/         # Feature pages
│           ├── layout.tsx      # Page Folder Layout
│           ├── not-found.tsx   # Not Found Page
│           └── page.tsx        # Page
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── common/             # Custom reusable components
│   │   ├── agreement-card.tsx
│   │   └── ...
│   ├── pages/              # Page-specific components
│   │   └── {page}/
│   └── layout/             # Layout components (Header, Sidebar)
├── hooks/
│   ├── queries/            # TanStack Query hooks
│   │   ├── use-agreements.ts
│   │   ├── use-auth.ts
│   └── common/             # Shared hooks
├── icons/                  # Icon components
├── lib/
│   ├── api/                # API client configuration
│   ├── utils.ts            # cn() utility and other helpers
│   └── validations/        # Zod schemas for forms
├── i18n/
│   ├── ssg.ts              # Translations loader for SSG
│   ├── config.ts           # i18n config
│   └── en-GB.tsx           # English (GB) translations
└── types/                  # TypeScript type definitions
```

---

## 3. Prompting Patterns for Frontend

### Pattern 1: Component Creation

**Good Prompt:**
```
Create an AgreementCard component using shadcn/ui that displays:
- Agreement title and description
- Status badge (active/pending/expired) using shadcn Badge
- Effective date range
- Action buttons (view, edit) using shadcn Button

Requirements:
- TypeScript with proper prop types
- Use Tailwind CSS with cn() utility for styling
- Include loading skeleton state using shadcn Skeleton
- Follow existing component patterns in src/components/common/
```

**Bad Prompt:**
```
Make a card for agreements
```

### Pattern 2: Hook Creation (TanStack Query)

**Good Prompt:**
```
Create a TanStack Query hook for the agreements API:

Endpoint: GET /api/v1/agreements
Query params: status, page, pageSize, sortBy

Requirements:
- Follow existing hook patterns in src/hooks/queries/
- Include proper TypeScript types
- Handle loading, error, and empty states
- Support pagination with placeholderData
- Invalidate on mutation
```

### Pattern 3: Refactoring Request

**Good Prompt:**
```
Refactor the AgreementsTable component:

Current issues:
1. Component is 400+ lines
2. Mixed concerns (data fetching + UI)
3. Inline styles instead of Tailwind classes

Goals:
- Extract data fetching to custom hook
- Split into smaller sub-components
- Use shadcn DataTable pattern
- Keep existing behavior/tests passing

Do NOT:
- Change the API contract
- Add new features
- Modify unrelated files
```

### Pattern 4: Scope Control (Critical!)

Always include scope constraints:
```
IMPORTANT:
- Only modify files I mention
- Do not refactor unrelated code
- Do not add features I didn't ask for
- If you see improvements, mention them but don't implement
- Ask if something is unclear
```

---

## 4. Quality Gates & Testing

### Pre-Commit Checklist

```bash
# Run ALL before committing
npm run lint          # Zero errors required
npm run typecheck     # Zero type errors required
npm run test:coverage # >90% coverage required
npm run test:e2e      # All E2E tests pass
```

### Unit Testing Standards

**Test Organization:**
```typescript
// Component: agreement-card.spec.tsx
describe('AgreementCard', () => {
  describe('rendering', () => {
    it('should render agreement title and description', () => { });
    it('should render status badge with correct variant', () => { });
    it('should render date range formatted correctly', () => { });
  });

  describe('interactions', () => {
    it('should call onView when view button clicked', () => { });
    it('should call onEdit when edit button clicked', () => { });
  });

  describe('loading state', () => {
    it('should render skeleton when loading', () => { });
  });

  describe('error state', () => {
    it('should render error message when data fails', () => { });
  });
});
```

**Testing Patterns:**
```typescript
// ✅ CORRECT: Test behavior, not implementation
it('should display agreement title', () => {
  render(<AgreementCard agreement={mockAgreement} />);
  expect(screen.getByText('Service Agreement')).toBeInTheDocument();
});

// ❌ WRONG: Testing implementation details (Tailwind classes)
it('should have correct className', () => {
  const { container } = render(<AgreementCard agreement={mockAgreement} />);
  expect(container.firstChild).toHaveClass('rounded-lg');
});
```

### E2E Testing (Playwright)

**What to Test:**
- Critical user journeys (login, CRUD operations)
- Form submissions and validation
- Navigation flows
- Error states and recovery
- Loading states

**Pattern:**
```typescript
// tests/e2e/agreements.spec.ts
test.describe('Agreements Page', () => {
  test('should filter agreements by status', async ({ page }) => {
    await page.goto('/agreements');
    await page.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'Active' }).click();

    await expect(page.getByTestId('agreement-row')).toHaveCount(5);
    await expect(page.getByText('Expired')).not.toBeVisible();
  });
});
```

### Coverage Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Statements | 90% | 95% |
| Branches | 90% | 95% |
| Functions | 90% | 95% |
| Lines | 90% | 95% |

---

## 5. UI Component Standards (shadcn/ui + Tailwind)

### Mandatory shadcn/ui Usage

```typescript
// ✅ CORRECT: Use shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ❌ WRONG: Don't use competing UI frameworks
import { Button } from '@chakra-ui/react';  // NOT ALLOWED
import { Button } from 'antd';              // NOT ALLOWED
import { Button } from '@mui/material';     // NOT ALLOWED
```

### Styling with Tailwind CSS + cn() Utility

```typescript
// ✅ CORRECT: Tailwind classes with cn() for conditional styling
import { cn } from '@/lib/utils';

<Card className={cn(
  'p-4 mb-4 transition-shadow',
  isHovered && 'shadow-lg'
)}>

// ✅ CORRECT: Consistent spacing and theme tokens
<div className="bg-background text-foreground rounded-md border">

// ✅ CORRECT: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ WRONG: Inline styles
<div style={{ padding: '16px', marginBottom: '16px' }}>

// ❌ WRONG: CSS modules with shadcn components
import styles from './Card.module.css';
```

### The cn() Utility (MANDATORY)

```typescript
// lib/utils.ts - Standard shadcn/ui utility
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage examples:
cn('px-4 py-2', isActive && 'bg-primary')
cn('text-sm', className) // Merge with passed className prop
cn('rounded', variant === 'outline' && 'border-2')
```

### Component Patterns

```typescript
// Standard component structure with shadcn/ui
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AgreementCardProps {
  agreement: Agreement;
  onView?: (agreement: Agreement) => void;
  onEdit?: (agreementId: string) => void;
  loading?: boolean;
  className?: string;
}

export function AgreementCard({
  agreement,
  onView,
  onEdit,
  loading = false,
  className,
}: AgreementCardProps) {
  if (loading) {
    return <AgreementCardSkeleton className={className} />;
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{agreement.title}</CardTitle>
          <Badge variant={getStatusVariant(agreement.status)}>
            {agreement.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{agreement.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(agreement)}>
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="secondary" size="sm" onClick={() => onEdit(agreement.id)}>
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AgreementCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
}
```

### Theming with CSS Variables

```css
/* globals.css - shadcn/ui theme configuration */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

---

## 6. Common LLM Failure Modes & Mitigations

### Failure 1: Over-Complicated UI Logic

**Symptom**: LLM creates complex state management for simple UI
**Example**: Using useReducer + context for a single toggle

**Mitigation Prompt**:
```
Keep this simple. Use useState for local state.
Do not create context providers or complex state management.
This is a single-component concern.
```

### Failure 2: Wrong Assumptions About Look/Behavior

**Symptom**: LLM adds animations, hover effects, or behaviors not requested
**Example**: Adding complex framer-motion animations to a simple modal

**Mitigation Prompt**:
```
Implement ONLY what I described.
Do not add:
- Animations or transitions (unless specified)
- Hover effects beyond Tailwind defaults (unless specified)
- Additional features or "improvements"

If you think something should be added, ask first.
```

### Failure 3: Breaking Existing Patterns

**Symptom**: LLM uses different patterns than codebase
**Example**: Using styled-components when project uses Tailwind

**Mitigation Prompt**:
```
Before writing code, check existing patterns in:
- src/components/common/ for component structure
- src/hooks/queries/ for data fetching patterns

Match the existing code style exactly.
Use Tailwind CSS with cn() utility - no other styling approaches.
```

### Failure 4: Hallucinated shadcn/ui Components

**Symptom**: LLM uses non-existent shadcn components or props
**Example**: `<Button colorScheme="blue">` (not a shadcn prop)

**Mitigation**:
1. Use `context7` MCP to fetch shadcn/ui docs
2. Verify components at https://ui.shadcn.com
3. Ask: "Verify this shadcn/ui component/prop exists"

### Failure 5: Incorrect Tailwind Classes

**Symptom**: LLM uses non-existent Tailwind utilities
**Example**: `className="color-primary"` (should be `text-primary`)

**Mitigation**:
1. Use `context7` MCP to fetch Tailwind docs
2. Stick to standard Tailwind utilities
3. Use CSS variables from globals.css for theme tokens

---

## 7. Review Workflow

### Self-Review Checklist (Before PR)

```markdown
## Frontend PR Checklist

### Architecture
- [ ] No SSR/API routes (Next.js static export only)
- [ ] Data fetching via TanStack Query only
- [ ] shadcn/ui components used (no competing frameworks)

### Code Quality
- [ ] TypeScript strict mode compliant
- [ ] No `any` types
- [ ] No `// @ts-ignore` without justification
- [ ] Functions < 50 lines
- [ ] Using cn() utility for conditional classes

### Styling
- [ ] Tailwind CSS classes only (no inline styles)
- [ ] Using theme tokens (text-foreground, bg-background, etc.)
- [ ] Responsive design with breakpoints (sm:, md:, lg:)
- [ ] Dark mode support verified

### Testing
- [ ] Unit tests added/updated
- [ ] Coverage > 90%
- [ ] E2E tests for user flows
- [ ] All tests passing

### Documentation
- [ ] docs/features/ updated
- [ ] Complex logic has comments

### LLM-Generated Code Review
- [ ] Reviewed all AI-generated code line by line
- [ ] Removed unnecessary complexity
- [ ] Verified no hallucinated imports/components
- [ ] Tested edge cases manually
```

### Code Review Focus Areas (AI-Generated Code)

1. **Import statements**: Verify all imports exist
2. **shadcn components**: Verify components/props are valid
3. **Tailwind classes**: Check for non-existent utilities
4. **Hook dependencies**: Check useEffect/useMemo deps
5. **Type assertions**: Look for unsafe `as` casts
6. **Error handling**: Ensure errors aren't swallowed

---

## 8. Feature Catalogue Maintenance

### Before Making Changes

1. Check `docs/features/` for related features
2. Identify affected components, hooks, and pages
3. Note any cross-references

### After Making Changes

```bash
# Update feature docs
docs/features/agreement-management.md
```

### Documentation Template

```markdown
## Component: AgreementCard

### Location
`src/components/common/agreement-card.tsx`

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| agreement | Agreement | Yes | Agreement data object |
| onView | (agreement: Agreement) => void | No | View callback |
| onEdit | (id: string) => void | No | Edit callback |
| loading | boolean | No | Show skeleton state |
| className | string | No | Additional CSS classes |

### States
- Default: Displays agreement information
- Loading: Shows skeleton placeholder
- Error: Shows error message with retry

### Usage
```tsx
<AgreementCard
  agreement={agreementData}
  onView={handleView}
  onEdit={handleEdit}
  className="w-full"
/>
```
```

---

## 9. Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server

# shadcn/ui
npx shadcn@latest add button   # Add a component
npx shadcn@latest add card     # Add card component
npx shadcn@latest diff         # Check for component updates

# Quality
npm run lint                   # ESLint
npm run lint:fix               # Auto-fix lint issues
npm run typecheck              # TypeScript check
npm run test:unit              # Run unit tests
npm run test:coverage          # Tests with coverage
npm run test:e2e               # Playwright E2E tests
npm run test                   # Run unit tests with coverage and Playwright E2E tests
npm run validate               # Run all mandatory quality checks at once

# Build
npm run build                  # Production build
```

---

## 10. shadcn/ui Quick Reference

### Adding Components

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table

# Add multiple components
npx shadcn@latest add button card input dialog
```

### Common Component Variants

```typescript
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>

// Badge variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Form Patterns (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AgreementForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Agreement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

## Appendix: Prompt Templates

### New Component
```
Create a [ComponentName] component in src/components/common/

Requirements:
- [List specific requirements]
- Use shadcn/ui components only
- Style with Tailwind CSS + cn() utility
- Include TypeScript types
- Add unit tests in same directory
- Follow patterns from [similar component]

Do not:
- Add features not listed
- Use CSS modules or styled-components
- Create unnecessary abstractions
- Use inline styles
```

### Bug Fix
```
Fix bug in [Component/Hook]:

Current behavior: [describe]
Expected behavior: [describe]
Steps to reproduce: [list]

Constraints:
- Only modify [specific files]
- Keep changes minimal
- Add regression test
```

### Refactor
```
Refactor [Component/Module]:

Goals:
- [List specific improvements]

Constraints:
- Keep external API unchanged
- All existing tests must pass
- No new features
- Continue using Tailwind CSS + cn() for styling

Show plan first, then implement.
```

---

**Remember**: LLM output requires human review. Always verify generated code against project standards before committing.
