# GitHub Copilot Instructions

## Project Overview

This is a **Personal Finance Expense Tracker** web application built with React, TypeScript, and modern frontend technologies. It's a client-side only application with no backend - all data is stored in browser LocalStorage.

## Tech Stack & Patterns

### Core Technologies
- **React 18.3** with functional components and hooks
- **TypeScript** - strictly typed, no `any` types
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** components (Radix UI primitives)

### State Management
- Use **React Context API** for global state (see `TransactionContext`)
- Use **TanStack Query** for async operations if needed
- Prefer `useState` and `useMemo` for local component state

### Styling Guidelines
- Use **Tailwind CSS** utility classes exclusively
- Follow shadcn/ui component patterns
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Maintain responsive design with mobile-first approach
- Use the existing color scheme: `primary`, `secondary`, `muted`, `destructive`

### Component Patterns
- All components should be **functional components** with TypeScript
- Use React Hook Form + Zod for form validation
- Import UI components from `@/components/ui/`
- Keep components in `src/components/` directory
- Use `lucide-react` for icons

### Data Management
- All data operations go through `TransactionContext`
- Use `transaction-storage.ts` for LocalStorage operations
- Never use `any` type - define proper types in `src/types/`
- Use `date-fns` for all date operations (not `moment` or native Date methods)

### File Organization
```
src/
├── components/     # Feature components and UI components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── pages/          # Route pages
└── types/          # TypeScript type definitions
```

## Code Style Rules

### TypeScript
```typescript
// ✅ DO: Use proper typing
interface Transaction {
  id: string;
  amount: number;
  // ...
}

// ❌ DON'T: Use any
const handleData = (data: any) => { }

// ✅ DO: Use type inference where obvious
const [count, setCount] = useState(0);

// ✅ DO: Use proper imports with aliases
import { Button } from '@/components/ui/button';
```

### React Patterns
```typescript
// ✅ DO: Use functional components with hooks
const MyComponent = () => {
  const [state, setState] = useState<Type>(initialValue);
  
  useMemo(() => {
    // expensive computation
  }, [dependencies]);
  
  return <div>...</div>;
};

// ❌ DON'T: Use class components
class MyComponent extends React.Component { }
```

### Forms
```typescript
// ✅ DO: Use React Hook Form + Zod
const form = useForm<FormSchema>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... }
});

const onSubmit = (data: FormSchema) => {
  // handle form submission
};
```

### Styling
```typescript
// ✅ DO: Use Tailwind utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">

// ✅ DO: Use cn() for conditional classes
<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  isActive && "active-classes"
)}>

// ❌ DON'T: Use inline styles
<div style={{ display: 'flex' }}>
```

### Date Handling
```typescript
// ✅ DO: Use date-fns
import { format, startOfMonth, isSameMonth } from 'date-fns';

const formatted = format(date, 'MMMM yyyy');
const monthStart = startOfMonth(date);

// ❌ DON'T: Use native Date methods
const formatted = date.toLocaleDateString();
```

## Transaction Type Definitions

```typescript
type TransactionType = 'income' | 'expense';

type TransactionCategory = 
  | 'Food' | 'Travel' | 'Bills' | 'Shopping' 
  | 'Entertainment' | 'Healthcare'
  | 'Salary' | 'Freelance' | 'Investment' | 'Other';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date;
  createdAt: Date;
}
```

## Component Guidelines

### Creating New Components
1. Place in appropriate directory (`components/` or `components/ui/`)
2. Use TypeScript with proper prop types
3. Export as default if main component, named export for utilities
4. Include proper imports with `@/` alias
5. Add JSDoc comments for complex components

### UI Components (shadcn/ui)
- Import from `@/components/ui/`
- Don't modify these directly - extend or wrap them
- Use the provided component variants and props

### Feature Components
- Keep focused on single responsibility
- Extract reusable logic to custom hooks
- Use proper prop destructuring with TypeScript

## Testing Considerations
- When writing new features, ensure they work with the existing LocalStorage system
- Validate all forms with Zod schemas
- Handle loading and error states appropriately
- Use toast notifications for user feedback

## Performance Best Practices
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to children
- Memoize filtered/sorted data in lists
- Lazy load routes if the app grows

## Accessibility
- Ensure all interactive elements are keyboard accessible
- Use semantic HTML elements
- Include ARIA labels where necessary
- Maintain proper color contrast (handled by Tailwind theme)

## Common Patterns in This Project

### Adding a Transaction
```typescript
const { addTransaction } = useTransactions();
addTransaction({
  type: 'expense',
  amount: 100,
  category: 'Food',
  description: 'Lunch',
  date: new Date()
});
```

### Filtering Transactions
```typescript
const filtered = useMemo(() => {
  return transactions.filter(t => {
    const categoryMatch = selectedCategory === 'all' || t.category === selectedCategory;
    const monthMatch = selectedMonth === 'all' || format(t.date, 'MMMM yyyy') === selectedMonth;
    return categoryMatch && monthMatch;
  });
}, [transactions, selectedCategory, selectedMonth]);
```

### Toast Notifications
```typescript
const { toast } = useToast();
toast({
  title: 'Success',
  description: 'Transaction added successfully.',
});
```

## What NOT to Suggest
- ❌ Backend/API calls - this is a client-only app
- ❌ CSS Modules or styled-components - use Tailwind only
- ❌ Class components - use functional components only
- ❌ Redux or other state management - use Context API
- ❌ Custom CSS files - use Tailwind utilities
- ❌ Database integrations - use LocalStorage only

## When Suggesting New Features
1. Keep it client-side (no backend)
2. Ensure data persists in LocalStorage
3. Follow existing patterns and component structure
4. Maintain TypeScript strict typing
5. Use existing UI components from shadcn/ui
6. Add proper error handling and user feedback
7. Ensure mobile responsiveness
