# Presentations API & Features

This directory contains the API services and related functionality for managing presentations in the Outlinr application.

## Overview

The presentation features include:
- Creating new presentations
- Fetching recent presentations (top 3 most recently opened)
- Paginated presentation listing (9 per page)
- Updating presentation metadata
- Tracking last opened timestamps
- Deleting presentations

## Structure

```
client/src/
├── lib/api/
│   ├── presentations.ts    # API service functions
│   └── index.ts            # Exports
├── types/
│   ├── presentation.ts     # TypeScript interfaces
│   └── index.ts            # Exports
├── hooks/
│   └── use-presentations.ts # React hooks for data fetching
└── pages/app/
    ├── (home)/
    │   ├── home/           # Recent presentations (3)
    │   └── dashboard/      # All presentations (paginated)
    └── _components/
        ├── new-presentation-button.tsx
        ├── recent-presentations.tsx
        └── presentation-skeleton.tsx
```

## API Functions

### `createPresentation(input?)`
Creates a new presentation and returns the created object.

```typescript
const presentation = await createPresentation({
  title: 'My Presentation',
  description: 'Optional description'
});
```

### `getRecentPresentations()`
Fetches the 3 most recently opened presentations, ordered by `last_opened_at` descending.

```typescript
const presentations = await getRecentPresentations();
```

### `getPresentations(page, pageSize)`
Fetches paginated presentations (default 9 per page).

```typescript
const result = await getPresentations(1, 9);
// Returns: { data, total, page, pageSize, hasMore }
```

### `updatePresentation(id, input)`
Updates a presentation's metadata.

```typescript
await updatePresentation(presentationId, {
  title: 'Updated Name',
  thumbnail_url: 'https://...'
});
```

### `updateLastOpened(id)`
Updates the `last_opened_at` timestamp (useful for tracking recent activity).

```typescript
await updateLastOpened(presentationId);
```

### `deletePresentation(id)`
Permanently deletes a presentation.

```typescript
await deletePresentation(presentationId);
```

## React Hooks

### `useRecentPresentations()`
Hook for fetching recent presentations with loading states.

```typescript
const { presentations, isLoading, error, refetch } = useRecentPresentations();
```

### `usePresentations(options)`
Hook for fetching paginated presentations.

```typescript
const {
  presentations,
  isLoading,
  error,
  refetch,
  page,
  setPage,
  hasMore,
  total
} = usePresentations({ pageSize: 9 });
```

## Components

### `<NewPresentationButton />`
Button that creates a new presentation and navigates to `/app/presentation/:id/question`.

### `<RecentPresentations />`
Displays the 3 most recently opened presentations with loading skeletons.

### `<PresentationSkeleton />`
Loading skeleton for individual presentation cards.

### `<PresentationSkeletonGrid count={n} />`
Grid of loading skeletons (used during data fetching).

## Database Schema

The presentations table should have the following columns:

```sql
create table public.presentations (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title character varying(255) not null default 'Untitled Presentation'::character varying,
  description text null,
  thumbnail_url text null,
  last_opened_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint presentations_pkey primary key (id),
  constraint presentations_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_presentations_user_id on public.presentations using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_presentations_last_opened on public.presentations using btree (last_opened_at desc) TABLESPACE pg_default;

create index IF not exists idx_presentations_created_at on public.presentations using btree (created_at desc) TABLESPACE pg_default;

create trigger update_presentations_updated_at BEFORE
update on presentations for EACH row
execute FUNCTION update_updated_at_column ();
```

## Usage Examples

### Creating a new presentation
```typescript
import { createPresentation } from '@/lib/api/presentations';
import { useNavigate } from 'react-router';

const navigate = useNavigate();
const presentation = await createPresentation();
navigate(`/app/presentation/${presentation.id}/question`);
```

### Home page (Recent 3)
```typescript
import { useRecentPresentations } from '@/hooks/use-presentations';

function HomePage() {
  const { presentations, isLoading } = useRecentPresentations();
  
  if (isLoading) return <PresentationSkeletonGrid count={3} />;
  return <div>{/* Render presentations */}</div>;
}
```

### Dashboard (Paginated)
```typescript
import { usePresentations } from '@/hooks/use-presentations';

function DashboardPage() {
  const { presentations, page, setPage, hasMore } = usePresentations({ pageSize: 9 });
  
  return (
    <div>
      {/* Render presentations */}
      <button onClick={() => setPage(page + 1)} disabled={!hasMore}>
        Next Page
      </button>
    </div>
  );
}
```

## Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const presentation = await createPresentation();
} catch (error) {
  console.error('Failed to create presentation:', error);
  toast.error('Failed to create presentation');
}
```

The custom hooks handle errors internally and expose them via the `error` state.

## Authentication

All API functions require an authenticated user. They use Supabase's `auth.getUser()` to:
1. Verify the user is logged in
2. Associate presentations with the correct user
3. Filter presentations by user ownership

## Loading States

All pages using presentations show loading skeletons:
- Home page: 3 skeletons (grid layout)
- Dashboard: 9 skeletons (grid layout)

Skeletons match the aspect ratio and layout of actual presentation cards.

## Future Enhancements

Potential improvements:
- [ ] Search/filter presentations
- [ ] Folders/categories
- [ ] Sharing presentations
- [ ] Duplicate presentation
- [ ] Presentation templates
- [ ] Thumbnail generation
- [ ] Sorting options (name, date, etc.)
- [ ] Bulk operations (delete multiple)