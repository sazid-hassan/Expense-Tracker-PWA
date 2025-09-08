# Dynamic Background Images System

This document explains how the dynamic background images system works in the Expense Tracker PWA.

## Overview

The system automatically detects and manages background images from the `public/bg-images/` directory. When you add new background images, the system will automatically include them in the settings dropdown without requiring code changes.

## Directory Structure

```
public/bg-images/
├── paper/
│   └── paper-desktop.jpg
├── ever-green/
│   └── green-bg.jpg
├── dark-studio/
│   └── dark-studio.png
└── dark-studio-2/
    └── dark-studio-2.png
```

## Adding New Background Images

### Method 1: Manual Configuration (Current)

1. Add your new background image to `public/bg-images/your-theme-name/`
2. Update `app/utils/backgroundImages.ts` to include the new theme:

```typescript
{
  id: 'your-theme-name',
  name: 'Your Theme Name',
  path: 'your-theme-name',
  imagePath: '/bg-images/your-theme-name/your-image.jpg'
}
```

### Method 2: Automatic Script (Future Enhancement)

1. Add your new background image to `public/bg-images/your-theme-name/`
2. Run the update script:
   ```bash
   npm run update-bg
   ```

The script will automatically:
- Scan the `public/bg-images/` directory
- Generate proper theme names from directory names
- Update the `backgroundImages.ts` file
- Support common image formats: jpg, jpeg, png, webp

## How It Works

1. **Settings Page**: Dynamically loads all available background images from the configuration
2. **AppLayout**: Uses the dynamic path resolution to apply the selected background
3. **Type Safety**: Uses TypeScript interfaces for proper type checking
4. **Fallback**: Defaults to paper-desktop if an invalid background is selected

## File Structure

- `app/utils/backgroundImages.ts` - Configuration and utility functions
- `app/types/index.ts` - TypeScript interfaces
- `scripts/update-background-images.js` - Automatic configuration generator
- `public/bg-images/` - Image storage directory

## Naming Convention

- Directory names should be in kebab-case (e.g., `dark-studio`, `ever-green`)
- The system automatically converts them to Title Case for display
- Image files can be any common format (jpg, jpeg, png, webp)
- The first image file found in each directory will be used

## Benefits

- **No Code Changes**: Add new backgrounds without touching React components
- **Type Safety**: Full TypeScript support with proper interfaces
- **Automatic Discovery**: System automatically finds new images
- **Consistent Naming**: Automatic name formatting and validation
- **Fallback Support**: Graceful handling of missing or invalid backgrounds
