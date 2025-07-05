# Expense Tracker

A simple, responsive, and progressive web application (PWA) for tracking personal expenses and income. This application is built with Next.js and utilizes Zustand for state management with local persistence, Material-UI for a modern user interface, and includes internationalization (i18n) support.

## Features

*   **Transaction Management:** Add, view, and categorize income and expense transactions. Transactions can be filtered by date range, month, and year.
*   **Category Management:** Create, edit, and delete custom categories for transactions. Edit and delete actions are represented by intuitive icons.
*   **Data Persistence:** All transaction, category, and user settings are automatically saved locally in the browser's `localStorage`.
*   **Data Import/Export:** Ability to export all application data (transactions, categories, and settings) to a JSON file and import it back.
*   **Data Deletion:** A "Delete All Data" option in settings allows users to clear all their data with a confirmation step.
*   **Interactive Charts:** Visualize financial data with yearly and monthly income/expense line charts, and a category-wise spending bar chart on the homepage.
*   **Responsive Design:** Optimized for various screen sizes, including mobile (with a hamburger menu).
*   **Internationalization (i18n):** Supports multiple languages (English, Bangla, Dutch, Spanish, Portuguese, Arabic) for a localized user experience.
*   **PWA Capabilities:** Configured for offline access and installability on supported devices.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **State Management:** [Zustand](https://zustand-bear.github.io/)
*   **UI Library:** [Material-UI (MUI)](https://mui.com/)
*   **PWA:** [next-pwa](https://www.npmjs.com/package/next-pwa)
*   **Styling:** CSS Modules (via `globals.css`)
*   **Unique IDs:** [uuid](https://www.npmjs.com/package/uuid)
*   **Linting:** ESLint
*   **Type Checking:** TypeScript

## Language Support

The application supports English, Bangla, Dutch, Spanish, Portuguese, and Arabic. These languages can be selected from the settings page.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18.x or higher)
*   npm, yarn, or pnpm (npm is used in the commands below)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/expense-tracker.git
    cd expense-tracker
    ```

2.  **Install dependencies:**
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

## Project Structure

```
expense-tracker/
├── app/
│   ├── (website)/              # Grouping for website-related pages
│   │   ├── categories/         # Category management page
│   │   │   └── page.tsx
│   │   ├── settings/           # Application settings page
│   │   │   └── page.tsx
│   │   ├── transactions/       # Transaction management page
│   │   │   └── page.tsx
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components (e.g., AppLayout)
│   │   └── AppLayout.tsx
│   ├── hooks/                  # Custom React hooks (e.g., useTranslation)
│   │   └── useTranslation.ts
│   ├── locales/                # JSON translation files for i18n
│   │   ├── ar.json
│   │   ├── bn.json
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── nl.json
│   │   └── pt.json
│   ├── store/                  # Zustand store for global state management
│   │   └── useStore.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── favicon.ico
│   ├── globals.css             # Global CSS styles
│   └── layout.tsx              # Root layout component (Next.js App Router)
├── public/                     # Static assets (images, manifest.json, sw.js)
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Key Concepts & Architecture

*   **Next.js App Router:** The project leverages Next.js 13+ App Router for routing and server-side rendering capabilities, although most components are client-side (`'use client'`).
*   **Zustand State Management:** `app/store/useStore.ts` defines the global state using Zustand. It includes `transactions`, `categories`, and `settings`. The `zustand/middleware/persist` is used to automatically save and load this state from `localStorage`, ensuring data persistence across sessions.
*   **Material-UI (MUI):** All UI components are built using MUI, providing a consistent and modern design language.
*   **Internationalization (i18n):** The `app/hooks/useTranslation.ts` hook dynamically loads translation strings from `app/locales/*.json` files based on the `language` setting in the Zustand store. This allows for easy addition of new languages and centralized management of text content.
*   **Type Safety:** The entire codebase is written in TypeScript, ensuring type safety and improving code maintainability.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Create a Pull Request.

### Code Style

This project uses ESLint for code linting. Please ensure your code adheres to the existing style by running:

```bash
npm run lint
```

### Adding New Translations

To add a new language:

1.  Add the new language to the `Language` enum in `app/types/index.ts`.
2.  Create a new JSON file (e.g., `xx.json`) in `app/locales/` with translations for all keys present in `en.json`.
3.  Add the new language to the `loadTranslations` switch statement in `app/hooks/useTranslation.ts`.

## Troubleshooting

*   **`EPERM: operation not permitted, open '.next\trace'` or similar file access errors on Windows:**
    This often occurs when a process holds a lock on a file. Try the following:
    1.  Close any running development servers or IDEs.
    2.  Manually delete the `.next` folder in the project root.
    3.  If the issue persists, restart your computer.

*   **`TypeError: Cannot read properties of undefined (reading 'deploymentId')` or other build errors after `npm install`:**
    This can indicate corrupted `node_modules` or `package-lock.json`. Try a clean reinstall:
    ```bash
    npm cache clean --force
    rmdir /s /q node_modules # Use `rm -rf node_modules` on macOS/Linux
    del package-lock.json # Use `rm package-lock.json` on macOS/Linux
    npm install
    ```

*   **Hydration Mismatch Errors:**
    These typically happen when server-rendered HTML doesn't match client-rendered content. Ensure that any data loaded from `localStorage` or other client-side-only sources is handled appropriately, often by conditionally rendering components after hydration or providing default values.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details. (Note: A `LICENSE` file is not included in the current project structure, but it's good practice to add one.)