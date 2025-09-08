# Expense Tracker PWA

A modern, responsive, and progressive web application (PWA) for tracking personal expenses and income. This application is built with Next.js 15 and features a beautiful mobile-first design with bottom navigation, comprehensive loading animations, Zustand for state management with local persistence, Material-UI for a modern user interface, full internationalization (i18n) support, and dynamic background themes.

## ✨ Features

### 📊 **Financial Management**
- **Transaction Management:** Add, view, edit, and delete income and expense transactions with smart category auto-selection
- **Advanced Filtering:** Filter transactions by date range, month, and year with intuitive modal filters
- **Category Management:** Create, edit, and delete custom categories with type classification (income/expense)
- **Interactive Charts:** Visualize financial data with yearly and monthly income/expense line charts, and category-wise spending bar charts
- **Real-time Analytics:** Track total income, expenses, monthly savings, and overall balance with color-coded metrics
- **Transaction Details:** View detailed transaction information in a beautiful modal interface

### 📱 **Mobile-First Design**
- **Bottom Navigation:** Thumb-friendly bottom navigation bar for mobile devices with smooth animations
- **Responsive Layout:** Adaptive design that works seamlessly across desktop, tablet, and mobile devices
- **Touch Optimized:** Enhanced touch interactions with proper gesture handling and visual feedback
- **Floating Action Button:** Quick access to add transactions with smart positioning above bottom navigation
- **Accordion Layout:** Mobile-optimized transaction display with expandable details

### 🎨 **Dynamic Background Themes**
- **Multiple Themes:** Paper, Ever Green, Dark Studio, and Dark Studio 2 backgrounds
- **Dynamic System:** Automatically detects and manages background images from the `public/bg-images/` directory
- **Easy Management:** Simple configuration system for adding new backgrounds
- **Auto-Generation:** Script to automatically update background configuration when new images are added
- **Theme Names:** Background theme names kept in English for universal understanding

### ✨ **Beautiful Loading System**
- **6 Loader Variants:** Spinner, dots, pulse, skeleton, overlay, and inline loaders for different contexts
- **Smooth Animations:** GPU-accelerated CSS animations with fade-in effects and modern transitions
- **Global Loading State:** System-wide loading management with customizable messages and variants
- **Smart Fallbacks:** Graceful handling of loading states with automatic category selection when data loads
- **Context-Aware:** Different loading animations for different operations (import, export, delete, etc.)

### 💾 **Data Management**
- **Local Persistence:** All data automatically saved to browser's `localStorage` with SSR-safe implementation
- **Import/Export:** Export data to JSON with beautiful loading animations, import with validation and progress feedback
- **Data Migration:** Automatic migration of old data format to new format with backward compatibility
- **Data Deletion:** Secure "Delete All Data" option with confirmation dialogs and loading states
- **Backup-Friendly:** Easy data migration between devices using JSON export/import
- **Error Handling:** Graceful handling of corrupted or missing data with automatic fallbacks

### 🌍 **Internationalization & Accessibility**
- **6 Languages:** English, Bangla, Dutch, Spanish, Portuguese, Arabic with RTL support
- **Dynamic Loading:** Translations loaded on-demand with elegant loading animations
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support
- **Type Safety:** Full TypeScript coverage for better developer experience and reliability
- **Theme Names:** Background theme names kept in English for universal understanding

### 🚀 **Progressive Web App**
- **Offline Capabilities:** Service worker implementation for offline access
- **Installable:** Can be installed on devices like a native app
- **Performance Optimized:** Fast loading with efficient caching strategies
- **Modern Web Standards:** Uses latest web technologies for optimal performance
- **PWA Manifest:** Proper manifest configuration for app installation

## 🛠️ Technologies Used

### **Core Technologies**
- **Framework:** [Next.js 15.3.5](https://nextjs.org/) with App Router
- **Language:** [TypeScript 5.8.3](https://www.typescriptlang.org/) for type safety
- **State Management:** [Zustand 5.0.6](https://zustand-bear.github.io/) with persistence middleware

### **UI & Design**
- **UI Library:** [Material-UI (MUI) 7.2.0](https://mui.com/) with Emotion styling
- **Icons:** Material Icons with extensive icon set
- **Styling:** TailwindCSS 4 + Material-UI for modern design system
- **Animations:** CSS keyframes with GPU acceleration
- **Charts:** [Recharts 3.0.2](https://recharts.org/) for data visualization

### **PWA & Performance**
- **PWA:** [next-pwa 5.6.0](https://www.npmjs.com/package/next-pwa) for offline capabilities
- **Service Worker:** Automatic caching and offline functionality
- **Performance:** Optimized loading with skeleton screens and lazy loading

### **Development Tools**
- **Linting:** ESLint with Next.js configuration
- **Unique IDs:** [uuid 11.1.0](https://www.npmjs.com/package/uuid) for data integrity
- **Build Tool:** Next.js build system with optimization

## 🌐 Language Support

The application supports **6 languages** with full internationalization:

| Language | Code | RTL Support | Status |
|----------|------|-------------|---------|
| English | EN | ❌ | ✅ Complete |
| Bangla | BN | ❌ | ✅ Complete |
| Dutch | NL | ❌ | ✅ Complete |
| Spanish | ES | ❌ | ✅ Complete |
| Portuguese | PT | ❌ | ✅ Complete |
| Arabic | AR | ✅ | ✅ Complete |

Languages can be easily selected from the settings page with instant switching and beautiful loading animations.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18.x or higher)
- npm, yarn, or pnpm (npm is used in the commands below)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sazid-hassan/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server with hot-reloading:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 📁 Project Structure

```
expense-tracker/
├── app/
│   ├── (website)/              # Route groups for organized pages
│   │   ├── categories/         # Category management with CRUD operations
│   │   │   └── page.tsx
│   │   ├── settings/           # User preferences and data management
│   │   │   └── page.tsx
│   │   ├── transactions/       # Transaction management with filtering
│   │   │   └── page.tsx
│   │   └── page.tsx            # Dashboard with charts and analytics
│   ├── components/             # Reusable UI components
│   │   ├── AppLayout.tsx       # Main layout with navigation and background
│   │   ├── TransactionModal.tsx # Transaction add/edit modal
│   │   ├── TransactionDetailsModal.tsx # Transaction view modal
│   │   ├── Loader.tsx          # Beautiful loading components system
│   │   ├── GlobalLoader.tsx    # Global loading state management
│   │   └── Sidebar.tsx         # Desktop sidebar navigation
│   ├── hooks/                  # Custom React hooks
│   │   └── useTranslation.ts   # i18n hook with loading states
│   ├── locales/                # Translation files (6 languages)
│   │   ├── ar.json            # Arabic (RTL)
│   │   ├── bn.json            # Bangla
│   │   ├── en.json            # English (default)
│   │   ├── es.json            # Spanish
│   │   ├── nl.json            # Dutch
│   │   └── pt.json            # Portuguese
│   ├── store/                  # Global state management
│   │   └── useStore.ts         # Zustand store with persistence + loading
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Interfaces and enums
│   ├── utils/                  # Utility functions
│   │   └── backgroundImages.ts # Dynamic background image management
│   ├── favicon.ico
│   ├── globals.css             # Global styles with TailwindCSS
│   └── layout.tsx              # Root layout with PWA configuration
├── public/                     # Static assets and PWA files
│   ├── bg-images/              # Dynamic background images
│   │   ├── paper/              # Paper theme
│   │   ├── ever-green/         # Ever Green theme
│   │   ├── dark-studio/        # Dark Studio theme
│   │   └── dark-studio-2/      # Dark Studio 2 theme
│   ├── icons/                  # PWA icons for installation
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker for offline support
├── scripts/                    # Utility scripts
│   └── update-background-images.js # Auto-update background config
├── docs/                       # Documentation
│   └── BACKGROUND_IMAGES.md    # Background images documentation
├── Configuration Files
├── eslint.config.mjs           # ESLint configuration
├── next.config.mjs             # Next.js + PWA configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🏗️ Key Concepts & Architecture

### **Application Architecture**
- **Next.js 15 App Router:** Leverages the latest App Router for file-based routing, server components, and optimal performance
- **Client-Side First:** Most components use `'use client'` for rich interactivity and real-time state updates
- **Mobile-First Design:** Built with mobile devices as the primary target, then enhanced for larger screens

### **State Management**
- **Zustand Store:** Centralized state management with `transactions`, `categories`, `settings`, and `loading` states
- **Persistence Middleware:** Automatic localStorage sync with SSR-safe implementation
- **Loading State Management:** Global loading system with customizable messages and animation variants
- **Type-Safe Actions:** All state mutations are strongly typed for developer experience
- **Data Migration:** Automatic migration of old data format to new format with backward compatibility

### **UI/UX Architecture**
- **Material-UI Foundation:** Consistent design system with theme integration and responsive components
- **Bottom Navigation:** Mobile-optimized thumb navigation with route-aware highlighting
- **Loading System:** 6 different loading variants (spinner, dots, pulse, skeleton, overlay, inline) for contextual feedback
- **Animation Framework:** GPU-accelerated CSS animations with smooth transitions and micro-interactions
- **Dynamic Backgrounds:** Automatic background theme management with easy addition of new themes

### **Internationalization System**
- **Dynamic Loading:** Translation files loaded on-demand with beautiful loading states
- **Zustand Integration:** Language preference stored in global state with instant switching
- **RTL Support:** Ready for right-to-left languages like Arabic
- **Extensible:** Easy addition of new languages through JSON files and enum updates

### **Development Experience**
- **TypeScript First:** Full type coverage with interfaces, enums, and strict type checking
- **Component Architecture:** Reusable components with props validation and consistent API
- **Performance Optimization:** Lazy loading, code splitting, and efficient re-rendering patterns
- **PWA Implementation:** Service worker, manifest, and offline-first architecture

## 🎨 Background Themes System

### **Current Themes**
- **Paper:** Clean paper texture background
- **Ever Green:** Natural green background
- **Dark Studio:** Dark studio environment
- **Dark Studio 2:** Alternative dark studio theme

### **Adding New Background Themes**

**Method 1: Manual Configuration**
1. Add your new background image to `public/bg-images/your-theme-name/`
2. Update `app/utils/backgroundImages.ts` to include the new theme configuration

**Method 2: Automatic Script**
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

## 📱 PWA Features

### **Installation**
- **Add to Home Screen:** Users can install the app on their devices
- **Standalone Mode:** Runs like a native app when installed
- **Offline Support:** Works offline with cached data and service worker

### **Performance**
- **Fast Loading:** Optimized bundle size and lazy loading
- **Caching Strategy:** Intelligent caching for static assets and data
- **Background Sync:** Automatic data synchronization when online

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Background Management
npm run update-bg    # Update background images configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'feat: Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a Pull Request.

### Code Style

This project uses ESLint for code linting. Please ensure your code adheres to the existing style by running:

```bash
npm run lint
```

### Adding New Translations

To add a new language:

1. **Add Language Enum:** Add the new language to the `Language` enum in `app/types/index.ts`
2. **Create Translation File:** Create a new JSON file (e.g., `fr.json`) in `app/locales/` with translations for all keys present in `en.json`
3. **Update Hook:** Add the new language case in the `loadTranslations` switch statement in `app/hooks/useTranslation.ts`
4. **Test Loading:** Verify the new language loads properly with the loading animation system

### Adding New Background Themes

To add a new background theme:

1. **Add Image:** Place your background image in `public/bg-images/your-theme-name/`
2. **Update Configuration:** Add the theme to `app/utils/backgroundImages.ts`
3. **Test:** Verify the theme appears in settings and applies correctly

### Adding New Loader Variants

To create custom loader animations:

1. **Define Variant:** Add new variant type to `LoaderVariant` in `app/components/Loader.tsx`
2. **Create Animation:** Add CSS keyframes for your custom animation
3. **Implement Renderer:** Add render function in the `getLoaderContent()` switch statement
4. **Update Types:** Ensure TypeScript types are updated for the new variant

## 🐛 Troubleshooting

### **Common Issues**

**Build/Development Issues:**
- **Next.js Build Errors:** Delete `.next` folder and `node_modules`, then run `npm install`
- **File Permission Errors (Windows):** Close all IDEs and development servers, restart if needed
- **Hydration Mismatches:** Ensure localStorage data has proper fallbacks for SSR

**Loading System Issues:**
- **Categories Not Loading:** Clear browser localStorage and refresh to reset state
- **Translations Stuck:** Check browser console for network errors, reload to retry
- **Modal Won't Open:** Verify categories have loaded properly, check browser console

**Mobile/Navigation Issues:**
- **Bottom Navigation Not Showing:** Ensure you're viewing on mobile breakpoint (< 600px width)
- **FAB Button Not Working:** Check if categories are loaded, try clearing localStorage
- **Touch Events Not Working:** Ensure proper touch-action CSS properties are applied

**Data Import Issues:**
- **Controlled Input Error:** This has been fixed with automatic data migration
- **Invalid Background Images:** System automatically falls back to default theme
- **Missing Data:** Automatic migration handles old data format gracefully

### **Clean Installation**
```bash
# Complete clean install
npm cache clean --force
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### **PWA Issues**
- **App Not Installing:** Check manifest.json and ensure HTTPS in production
- **Offline Mode Not Working:** Verify service worker registration in browser DevTools
- **Icons Not Showing:** Check public/icons/ directory for proper PWA icon files

## 📈 Recent Updates & Changelog

### **Version 3.0.1** - Latest Features ✨

**🎨 Dynamic Background Themes System:**
- **Multiple Themes:** Paper, Ever Green, Dark Studio, and Dark Studio 2
- **Dynamic Management:** Automatic detection and management of background images
- **Easy Addition:** Simple configuration system for adding new themes
- **Auto-Generation:** Script to automatically update background configuration
- **Theme Names:** Background theme names kept in English for universal understanding

**🔧 Data Migration & Error Handling:**
- **Backward Compatibility:** Automatic migration of old data format
- **Error Prevention:** Fixed controlled input errors when importing old data
- **Data Validation:** Comprehensive validation and fallback handling
- **Graceful Degradation:** System handles corrupted or missing data gracefully

**🚀 Mobile-First Design Overhaul:**
- **Bottom Navigation:** Implemented thumb-friendly bottom navigation for mobile devices
- **Enhanced FAB:** Floating Action Button with smart positioning above bottom navigation
- **Touch Optimization:** Improved touch interactions and gesture handling
- **Accordion Layout:** Mobile-optimized transaction display with expandable details

**✨ Beautiful Loading System:**
- **6 Loader Variants:** Spinner, dots, pulse, skeleton, overlay, and inline loaders
- **Global Loading State:** System-wide loading management with Zustand integration
- **Smooth Animations:** GPU-accelerated CSS animations with modern transitions
- **Smart Fallbacks:** Graceful handling of loading states and data hydration

**🎨 UI/UX Improvements:**
- **Modern Animations:** Fade-in effects, pulse animations, and micro-interactions
- **Better Mobile Experience:** Responsive design optimized for mobile-first usage
- **Enhanced Visual Feedback:** Loading states for all major operations (import, export, delete)
- **iOS-Style Design:** Beautiful glassmorphism effects and modern button styles

**🔧 Technical Enhancements:**
- **TypeScript Coverage:** Full type safety with improved developer experience
- **Performance Optimization:** Efficient re-rendering and state management
- **SSR-Safe Implementation:** Proper handling of localStorage and client-side hydration
- **Error Handling:** Comprehensive error handling and user feedback

### **Coming Soon** 🚧
- Multi-user support with authentication
- Cloud storage integration for data backup
- Advanced analytics and budgeting features
- Recurring transaction automation
- Enhanced search and filtering capabilities
- More background themes and customization options
- Dark mode toggle
- Advanced reporting and insights

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Material-UI](https://mui.com/) for the beautiful component library
- [Zustand](https://zustand-bear.github.io/) for the simple state management
- [Recharts](https://recharts.org/) for the data visualization
- [next-pwa](https://www.npmjs.com/package/next-pwa) for PWA capabilities

---

**Made with ❤️ by [Sazid Hassan](https://github.com/sazid-hassan)**