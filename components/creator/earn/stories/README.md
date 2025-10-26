# Instagram Stories Experience

This folder contains the Instagram stories-like experience that appears before the main landing page.

## Components

### `StoriesContainer.tsx`
Main orchestrator component that manages the stories flow:
- Handles state for current story index
- Manages auto-advance timer (6 seconds per story)
- Tracks if user has viewed stories (localStorage)
- Provides desktop Instagram-style layout with side previews
- Provides mobile fullscreen layout

### `StoryPanel.tsx`
Wrapper component for individual stories:
- Handles click/tap navigation (left 1/3 = previous, right 2/3 = next)
- Keyboard navigation (arrow keys, space, escape)
- Pause on hold (mouse/touch)
- Framer Motion animations

### `StoryProgressBar.tsx`
Instagram-style progress indicators at the top showing:
- Current story position
- Progress within current story
- Completed vs remaining stories

### `StoryContent1-4.tsx`
Individual story content components matching Figma designs:
1. Story 1: "RAISE YOUR HAND IF you want your payments faster!"
2. Story 2: "IF you sent payment reminders TILL THEY BROKE YOUR HEART 💔"
3. Story 3: "IF you messed up your invoices 🤯🤯GST & TAX MATHS ☠️"
4. Story 4: "🚫NO MORE!" with feature list

### `types.ts`
TypeScript interfaces for type safety

## Features

✅ Auto-advance timer (6 seconds per story)
✅ Click/tap navigation
✅ Keyboard navigation
✅ Pause on hold
✅ Progress indicators
✅ Desktop Instagram-style layout
✅ Mobile fullscreen layout
✅ localStorage persistence (skip on return visits)
✅ Skip button
✅ Smooth transitions

## User Flow

1. **First visit**: Shows all 4 stories → Landing page
2. **Return visits**: Skips stories, shows landing page directly
3. **Manual skip**: User can skip stories anytime via "Skip" button

## Controls

### Mouse/Touch
- Click left 1/3: Previous story
- Click right 2/3: Next story
- Hold: Pause auto-advance
- Skip button: Jump to landing page

### Keyboard
- Left arrow: Previous story
- Right arrow / Space: Next story
- Escape: Skip to landing page

## Customization

### Timing
Edit `STORY_DURATION` in `StoriesContainer.tsx` (default: 6000ms)

### Images
Replace gradient placeholders in `StoryContent1-4.tsx` with actual images:
```tsx
<div className="absolute top-[92px] left-1/2 -translate-x-1/2 w-[362px] h-[595px] rounded-3xl overflow-hidden">
  <Image
    src="/images/creator/earn/story-bg.jpg"
    alt="Background"
    fill
    className="object-cover"
  />
</div>
```

### Reset Stories View
To reset for testing, clear localStorage:
```javascript
localStorage.removeItem('storiesViewed');
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Framer Motion
- Tailwind CSS
