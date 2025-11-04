# Presentation Features

This directory contains reusable components for displaying and managing presentations throughout the application.

## Overview

The presentation features module provides a set of composable components that eliminate code duplication and ensure consistent presentation card UI across different pages (Home, Dashboard, etc.).

## Components

### `PresentationList`

The main container component that handles both grid and list view layouts, loading states, and rendering presentation items.

**Props:**

- `presentations`: Array of presentation objects
- `isLoading`: Boolean to show skeleton loaders
- `view`: `'grid'` or `'list'` layout mode
- `getHref`: Function to generate the link for each presentation
- `getMetadata`: Function to generate metadata text (e.g., date, time ago)
- `skeletonCount`: Number of skeleton items to show when loading (default: 6)

**Example:**

```tsx
<PresentationList
  presentations={presentations}
  isLoading={isLoading}
  view="grid"
  getHref={(p) => `/app/presentation/${p.id}/create`}
  getMetadata={(p) => formatDate(p.created_at)}
  skeletonCount={6}
/>
```

### `PresentationCard`

Grid view card component displaying a presentation thumbnail, title, metadata, and action buttons.

**Props:**

- `presentation`: Presentation object
- `href`: Link destination
- `metadata`: Metadata text to display (date, time, etc.)

### `PresentationListItem`

List view item component with horizontal layout showing thumbnail, title, metadata, and actions.

**Props:**

- `presentation`: Presentation object
- `href`: Link destination
- `metadata`: Metadata text to display

### `PresentationCardActions`

Action buttons overlay for presentation cards (Results and More options).

**Props:**

- `presentationId`: ID of the presentation
- `variant`: `'grid'` or `'list'` to adjust button styling

### `PresentationThumbnail`

Displays presentation thumbnail image or fallback logo.

**Props:**

- `thumbnailUrl`: Optional thumbnail URL
- `title`: Alt text for the image
- `className`: Optional additional CSS classes

### `PresentationCardSkeleton`

Loading skeleton component that matches the presentation card layout.

**Props:**

- `variant`: `'grid'` or `'list'` to match the layout

### `EmptyState`

Simple component for displaying empty or error states.

**Props:**

- `message`: The message to display

## Usage Examples

### Recent Presentations (Grid View)

```tsx
import { EmptyState, PresentationList } from '@/features/presentations';
import { formatTimeAgo } from '@/lib/utils';

const RecentPresentations = () => {
  const { presentations, isLoading, error } = useRecentPresentations();

  return (
    <section>
      <h2>Recently Viewed</h2>
      {error ? (
        <EmptyState message={error} />
      ) : presentations.length === 0 && !isLoading ? (
        <EmptyState message="No presentations yet." />
      ) : (
        <PresentationList
          presentations={presentations}
          isLoading={isLoading}
          view="grid"
          getHref={(p) => `/app/presentation/${p.id}/create`}
          getMetadata={(p) => formatTimeAgo(p.last_opened_at)}
          skeletonCount={3}
        />
      )}
    </section>
  );
};
```

### Dashboard (Grid/List Toggle)

```tsx
import { EmptyState, PresentationList } from '@/features/presentations';
import { formatDate } from '@/lib/utils';

const DashboardPage = () => {
  const { presentations, isLoading, error } = usePresentations();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <>
      {/* View toggle controls */}
      <ToggleGroup value={view} onValueChange={setView}>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
      </ToggleGroup>

      {error ? (
        <EmptyState message={error} />
      ) : presentations.length === 0 && !isLoading ? (
        <EmptyState message="No presentations yet." />
      ) : (
        <PresentationList
          presentations={presentations}
          isLoading={isLoading}
          view={view}
          getHref={(p) => `/app/presentation/${p.id}/create`}
          getMetadata={(p) => formatDate(p.created_at)}
          skeletonCount={6}
        />
      )}
    </>
  );
};
```

## Architecture Benefits

### Before Refactoring

- Presentation card UI was duplicated in multiple files
- Loading skeletons were duplicated
- Inconsistent implementations between pages
- Difficult to maintain and update

### After Refactoring

- ✅ Single source of truth for presentation cards
- ✅ Consistent UI across all pages
- ✅ Easy to update styling/behavior globally
- ✅ Reusable components with clear responsibilities
- ✅ Type-safe props with TypeScript
- ✅ Flexible metadata rendering via functions
- ✅ Support for both grid and list layouts

## Component Hierarchy

```
PresentationList
├── Loading State
│   └── PresentationCardSkeleton (x N)
└── Loaded State
    └── Grid View
        └── PresentationCard
            ├── PresentationThumbnail
            └── PresentationCardActions
    └── List View
        └── PresentationListItem
            └── PresentationCardActions
```

## Customization

The components are designed to be flexible:

1. **Metadata**: Pass any function to `getMetadata` to customize what info shows (created date, last opened, time ago, etc.)
2. **Navigation**: Use `getHref` to customize where cards link to
3. **Layout**: Toggle between grid and list views
4. **Loading States**: Adjust skeleton count based on page size

## Future Enhancements

Potential improvements for future iterations:

- Add context menu actions to the "More" button
- Support for drag-and-drop reordering
- Bulk selection and actions
- Custom action buttons per use case
- Thumbnail upload/edit functionality
- Favorites/pinning functionality
