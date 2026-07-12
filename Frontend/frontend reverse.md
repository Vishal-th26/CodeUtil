# Frontend Reverse Engineering Guide

This document explains the frontend portion of the project as a real codebase, file by file, with an emphasis on how the application starts, how data flows, what each file does, and how major features execute.

## 1. High-level architecture

The frontend is a React single-page experience built with Vite. It is not using a traditional React Router setup. Instead, the app uses a state-driven shell in [src/App.jsx](src/App.jsx) to switch between three primary views:

- landing
- auth
- dashboard

The flow is:

1. The browser loads [src/main.jsx](src/main.jsx).
2. [src/main.jsx](src/main.jsx) mounts the top-level React app by rendering [src/App.jsx](src/App.jsx).
3. [src/App.jsx](src/App.jsx) creates the shell and swaps between the landing experience, authentication view, and dashboard view.
4. The landing page is composed of many presentational components under [src/components](src/components).
5. The auth and dashboard experiences use state and props rather than router paths.
6. The app uses shared context from [src/context/AppContext.jsx](src/context/AppContext.jsx) to manage authentication and expose an API client.
7. The API layer in [src/api/client.js](src/api/client.js) talks to the backend over HTTP.

## 2. Entry point and startup sequence

### Program starts

The application starts when the browser loads the Vite-built entry HTML, which loads the bundled module entry from [src/main.jsx](src/main.jsx).

### Execution order

1. [src/main.jsx](src/main.jsx) imports React and the root app component.
2. [src/main.jsx](src/main.jsx) calls `createRoot(...).render(...)`.
3. The app renders [src/App.jsx](src/App.jsx).
4. [src/App.jsx](src/App.jsx) renders the `AppProvider` wrapper.
5. `AppProvider` in [src/context/AppContext.jsx](src/context/AppContext.jsx) creates the shared context and API client.
6. The `Shell` component inside [src/App.jsx](src/App.jsx) initializes state and renders the correct view.
7. The selected view renders its own child components.

### Sequence diagram

```text
browser load
  -> main.jsx
    -> createRoot().render(<App />)
      -> App.jsx
        -> AppProvider
          -> AppContext provider
            -> Shell state initialization
              -> landing/auth/dashboard rendering
```

## 3. File-by-file reverse engineering

### 3.1 [src/main.jsx](src/main.jsx)

#### Why this file exists
This is the runtime entry point for the frontend bundle.

#### Why it is placed in this folder
It sits at the top level of the source tree because Vite expects the application entry module to be discoverable from the root of the source directory.

#### When this file gets executed or imported
It is executed automatically when the app boots. The Vite runtime loads it as the root entry module.

#### Which file imports it
No file in the project imports it directly. The bundler loads it as the application entry point.

#### Which files it imports
- [src/App.jsx](src/App.jsx)
- [src/styles/global.css](src/styles/global.css)

#### Responsibilities
- Mount the React application to the DOM element with id `root`.
- Apply global styles.
- Start the React app in `StrictMode`.

#### Functions, constants, variables
- No local functions or constants. It uses one top-level render call.

#### How it communicates with other files
It imports the root app component and the global stylesheet. It does not call the backend directly.

#### Objects created inside it
- A React root object created by `createRoot(...)`.
- A React render tree containing `<App />`.

#### Data flow
- Input: the browser DOM element `#root`.
- Output: a mounted React tree rendered into that DOM element.

---

### 3.2 [src/App.jsx](src/App.jsx)

#### Why this file exists
This file is the central orchestrator of the frontend. It controls which experience the user sees and drives navigation between landing, auth, and dashboard.

#### Why it is placed in this folder
It is located at the root of the source folder because it acts as the application shell, composing many child modules into the main experience.

#### When this file gets executed or imported
It is imported by [src/main.jsx](src/main.jsx) when the app boots. The `Shell` component then renders depending on state.

#### Which file imports it
- [src/main.jsx](src/main.jsx)

#### Which files it imports
- [src/context/AppContext.jsx](src/context/AppContext.jsx)
- [src/components/Nav.jsx](src/components/Nav.jsx)
- [src/components/Hero.jsx](src/components/Hero.jsx)
- [src/components/Intro.jsx](src/components/Intro.jsx)
- [src/components/StatRow.jsx](src/components/StatRow.jsx)
- [src/components/Capabilities.jsx](src/components/Capabilities.jsx)
- [src/components/CaseStudy.jsx](src/components/CaseStudy.jsx)
- [src/components/Skillset.jsx](src/components/Skillset.jsx)
- [src/components/Showreel.jsx](src/components/Showreel.jsx)
- [src/components/Testimonials.jsx](src/components/Testimonials.jsx)
- [src/components/FAQ.jsx](src/components/FAQ.jsx)
- [src/components/Footer.jsx](src/components/Footer.jsx)
- [src/components/TransitionOverlay.jsx](src/components/TransitionOverlay.jsx)
- [src/views/AuthView.jsx](src/views/AuthView.jsx)
- [src/views/DashboardView.jsx](src/views/DashboardView.jsx)
- [src/App.css](src/App.css)

#### Responsibilities
- Manage the app’s current view (`landing`, `auth`, `dashboard`).
- Handle transitions between these views.
- Keep history state in sync with the current view.
- Scroll to section anchors when navigation requests come from the navbar or footer.
- Render the landing page, auth form, or dashboard UI based on state.

#### Functions, constants, variables
- `Shell()` component
- `scrollToHash(hash)`
- `goTo(next, opts = { push: true })`

State variables:
- `view`
- `sessionActive`
- `transitioning`
- `transitionTitle`
- `transitionMessage`
- `activeView`
- `pendingAnchor`

#### How it communicates with other files
- Passes `onStart`, `onNavigate`, `onLogout`, and `onAuthNav` props into child components.
- Uses the shared context from [src/context/AppContext.jsx](src/context/AppContext.jsx) indirectly through child components.

#### Objects created inside it
- React state values via `useState`.
- Transition overlay UI.
- Child component instances.

#### Objects returned
- The `App` component returns the `AppProvider` wrapper around `Shell`.
- `Shell` returns different JSX trees depending on `view`.

#### Data flow
- Input: user interactions such as clicking navigation links, auth actions, dashboard actions.
- Output: updated UI and browser history.

#### Major workflows
- Landing view rendering.
- Auth view transition.
- Dashboard view transition.
- Anchor-based scrolling.

---

### 3.3 [src/context/AppContext.jsx](src/context/AppContext.jsx)

#### Why this file exists
This file provides centralized state for auth and API access across the app.

#### Why it is placed in this folder
It belongs in `context` because it acts as a shared application state provider for multiple UI components.

#### When this file gets executed or imported
It is imported by [src/App.jsx](src/App.jsx), and its provider and hook are used by auth and dashboard components.

#### Which file imports it
- [src/App.jsx](src/App.jsx)
- [src/views/AuthView.jsx](src/views/AuthView.jsx)
- [src/views/DashboardView.jsx](src/views/DashboardView.jsx)

#### Which files it imports
- [src/api/client.js](src/api/client.js)

#### Responsibilities
- Hold authentication token and email state.
- Expose `login`, `logout`, and `api` objects to the rest of the app.
- Create a memoized API client that can read the latest auth token and base URL.

#### Functions, constants, variables
- `AppProvider({ children })`
- `useApp()`
- `AppContext`
- `baseUrl`, `setBaseUrl`, `token`, `setToken`, `email`, `setEmail`
- `tokenRef`, `baseUrlRef`
- `api`
- `isAuthed`

#### How it communicates with other files
- Creates an API client using `createApiClient(...)` from [src/api/client.js](src/api/client.js).
- Supplies values to any component that calls `useApp()`.

#### Objects created inside it
- A React context object.
- A memoized API client object.
- Refs for token and base URL.

#### Returned objects
- `AppProvider` returns a context provider.
- `useApp()` returns the current context value.

---

### 3.4 [src/api/client.js](src/api/client.js)

#### Why this file exists
This file provides all network requests used by the dashboard and auth experience.

#### Why it is placed in this folder
It is stored under `api` because it is the data access layer for backend communication.

#### When this file gets executed or imported
It is imported by [src/context/AppContext.jsx](src/context/AppContext.jsx) when the provider is created. Its exported functions are used later by auth and dashboard views.

#### Which file imports it
- [src/context/AppContext.jsx](src/context/AppContext.jsx)

#### Responsibilities
- Encapsulate HTTP calls to the backend.
- Normalize backend responses and errors.
- Attach auth headers when a token exists.

#### Functions, constants, variables
- `DEFAULT_BASE_URL`
- `ApiError`
- `parseResponse(res)`
- `createApiClient(getBaseUrl, getToken)`

#### How it communicates with other files
- Produces an API object that is consumed by [src/views/AuthView.jsx](src/views/AuthView.jsx) and [src/views/DashboardView.jsx](src/views/DashboardView.jsx).

#### Objects created inside it
- An `ApiError` object when a request fails.
- An API object with methods like `register`, `login`, `uploadFiles`, `ask`, `vivaQuestions`, `vivaAnswers`, `status`, and `endSession`.

#### Data flow
- Input: email/password/files/query from UI components.
- Output: parsed JSON or thrown `ApiError`.

---

### 3.5 [src/data/content.js](src/data/content.js)

#### Why this file exists
This file stores non-UI static content used to populate the landing page sections.

#### Why it is placed in this folder
It belongs in `data` because it holds content arrays and structured copy rather than component logic.

#### When this file gets executed or imported
It is imported by presentational components such as [src/components/Capabilities.jsx](src/components/Capabilities.jsx), [src/components/Skillset.jsx](src/components/Skillset.jsx), [src/components/Testimonials.jsx](src/components/Testimonials.jsx), and [src/components/FAQ.jsx](src/components/FAQ.jsx).

#### Which files import it
- [src/components/Capabilities.jsx](src/components/Capabilities.jsx)
- [src/components/Skillset.jsx](src/components/Skillset.jsx)
- [src/components/Testimonials.jsx](src/components/Testimonials.jsx)
- [src/components/FAQ.jsx](src/components/FAQ.jsx)

#### Responsibilities
- Provide structured content for the landing page.
- Keep copy separated from UI rendering logic.

#### Constants and variables
- `stats`
- `capabilities`
- `skillset`
- `pricingTiers`
- `testimonials`
- `stack`
- `faqs`

#### Data flow
- Input: none.
- Output: arrays of content objects used by components.

---

### 3.6 [src/styles/global.css](src/styles/global.css)

#### Why this file exists
This file defines the global baseline styles for the application.

#### Why it is placed in this folder
It sits in `styles` because it holds shared styling rules used across the whole app.

#### When this file gets executed or imported
Imported by [src/main.jsx](src/main.jsx) as a global stylesheet.

#### Which file imports it
- [src/main.jsx](src/main.jsx)

#### Responsibilities
- Define base typography, spacing, buttons, links, and scroll behavior.
- Provide shared utility classes like `.container` and `.btn`.

#### Data flow
- Input: none at runtime.
- Output: shared styling applied to the document.

---

### 3.7 [src/styles/tokens.css](src/styles/tokens.css)

#### Why this file exists
Defines design tokens for colors, spacing, fonts, and other visual primitives.

#### Why it is placed in this folder
It is in the styles folder because it provides reusable design values for the UI.

#### When this file gets executed or imported
Imported by [src/styles/global.css](src/styles/global.css).

#### Responsibilities
- Centralize theme variables.

---

### 3.8 [src/styles/ui.css](src/styles/ui.css)

#### Why this file exists
Contains shared UI styling helpers and button styles that are used across the app.

#### Why it is placed in this folder
It belongs in the styles folder for reusable presentation rules.

#### When this file gets executed or imported
Imported by one of the style entry points or used by components that include it explicitly.

#### Responsibilities
- Shared UI styling.

---

## 4. Component-by-component breakdown

### 4.1 [src/components/Nav.jsx](src/components/Nav.jsx)

#### Why this file exists
It renders the header navigation for the landing and compact views.

#### Why it is placed in this folder
It is a reusable UI component and belongs in `components`.

#### When this file gets executed or imported
It is imported by [src/App.jsx](src/App.jsx) and rendered inside `Shell`.

#### Which file imports it
- [src/App.jsx](src/App.jsx)

#### Which files it imports
- [src/components/nav.css](src/components/nav.css)

#### Responsibilities
- Display top navigation links.
- Handle smooth scrolling to landing sections.
- Trigger the auth transition when the CTA button is clicked.

#### Functions, constants, variables
- `LINKS`
- `scrollToAnchor(href, onNavigate)`
- `Nav({ onStart, variant, onNavigate })`
- `scrolled`
- `open`

#### How it communicates with other files
- Uses `onStart` and `onNavigate` props to notify [src/App.jsx](src/App.jsx) of navigation requests.

#### Data flow
- Input: click events on links and CTA button.
- Output: anchor scroll requests or a view transition request.

---

### 4.2 [src/components/Hero.jsx](src/components/Hero.jsx)

#### Why this file exists
It renders the hero section at the top of the landing experience.

#### Why it is placed in this folder
It is a visual section component, so it lives under `components`.

#### When this file gets executed or imported
It is rendered from [src/App.jsx](src/App.jsx) as part of the landing view.

#### Which file imports it
- [src/App.jsx](src/App.jsx)

#### Which files it imports
- [src/components/IndexGrid.jsx](src/components/IndexGrid.jsx)
- [src/components/hero.css](src/components/hero.css)

#### Responsibilities
- Render the primary headline and CTA buttons.
- Show animated background layers using Framer Motion.
- Provide entry points to the rest of the landing page.

#### Functions, constants, variables
- `Hero()`
- `ref`
- `scrollYProgress`
- `y1`, `y2`, `opacity`

#### Data flow
- Input: none external beyond the component’s static content.
- Output: rendered hero section.

---

### 4.3 [src/components/Intro.jsx](src/components/Intro.jsx)

#### Why this file exists
It renders the introductory section for the landing page.

#### Why it is placed in this folder
It is a UI section component.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx) in the landing view.

#### Which file imports it
- [src/App.jsx](src/App.jsx)

#### Responsibilities
- Explain the product concept on first load.

---

### 4.4 [src/components/StatRow.jsx](src/components/StatRow.jsx)

#### Why this file exists
It renders a row of statistics and milestone figures.

#### Why it is placed in this folder
It is a section component for the landing page.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Which file imports it
- [src/App.jsx](src/App.jsx)

#### Responsibilities
- Display product-impact numbers.

---

### 4.5 [src/components/Capabilities.jsx](src/components/Capabilities.jsx)

#### Why this file exists
Renders the capabilities/feature cards section.

#### Why it is placed in this folder
It is a reusable landing page section component.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Which file imports it
- [src/App.jsx](src/App.jsx)

#### Which files it imports
- [src/data/content.js](src/data/content.js)
- [src/components/capabilities.css](src/components/capabilities.css)

#### Responsibilities
- Display content from `capabilities` data.
- Provide the `#capabilities` anchor target.

---

### 4.6 [src/components/CaseStudy.jsx](src/components/CaseStudy.jsx)

#### Why this file exists
Shows a case-study-style section to reinforce the product narrative.

#### Why it is placed in this folder
It is part of the landing page composition.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Responsibilities
- Present a narrative sample of how the product would be used.

---

### 4.7 [src/components/Skillset.jsx](src/components/Skillset.jsx)

#### Why this file exists
Renders the “How it works” section, which is one of the main landing-page destinations for navigation.

#### Why it is placed in this folder
It is a landing page section component with its own styles.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Which files it imports
- [src/data/content.js](src/data/content.js)
- [src/components/skillset.css](src/components/skillset.css)

#### Responsibilities
- Render the step-by-step workflow using the `skillset` data.
- Provide the `#how-it-works` anchor target.
- Support interactive step navigation with local state.

#### Functions, constants, variables
- `Skillset()`
- `goTo(index)`
- `scrollerRef`, `railRef`, `active`

---

### 4.8 [src/components/Showreel.jsx](src/components/Showreel.jsx)

#### Why this file exists
Renders a media-style walkthrough section.

#### Why it is placed in this folder
It is another landing-page section component.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Responsibilities
- Present motion or media content.
- Support playful interactivity.

---

### 4.9 [src/components/UnderTheHood.jsx](src/components/UnderTheHood.jsx)

#### Why this file exists
Renders a technical “under the hood” section.

#### Why it is placed in this folder
It is a section component for the landing page.

#### When this file gets executed or imported
It is imported by [src/App.jsx](src/App.jsx), but is currently commented out in the main composition.

#### Responsibilities
- Show implementation details when enabled.

---

### 4.10 [src/components/Testimonials.jsx](src/components/Testimonials.jsx)

#### Why this file exists
Renders the testimonials/reviews carousel.

#### Why it is placed in this folder
It is a landing-section component with its own interaction logic.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Which files it imports
- [src/data/content.js](src/data/content.js)
- [src/components/testimonials.css](src/components/testimonials.css)

#### Responsibilities
- Display testimonials in a paged slideshow.
- Provide the `#testimonials` anchor target.
- Allow next/previous navigation and dot-based jump navigation.

#### Functions, constants, variables
- `Testimonials()`
- `chunk()` helper
- `pages`
- `page`
- `trackRef`

---

### 4.11 [src/components/FAQ.jsx](src/components/FAQ.jsx)

#### Why this file exists
Renders the FAQ accordion section.

#### Why it is placed in this folder
It is a landing page section component.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Which files it imports
- [src/data/content.js](src/data/content.js)
- [src/components/faq.css](src/components/faq.css)

#### Responsibilities
- Display questions and answers in an expandable accordion.
- Provide the `#faq` anchor target.

---

### 4.12 [src/components/Footer.jsx](src/components/Footer.jsx)

#### Why this file exists
Renders the site footer and supports anchor-based navigation.

#### Why it is placed in this folder
It is a reusable UI component.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx).

#### Responsibilities
- Provide footer links and contact information.
- Route hash links to the correct landing sections.

#### Functions, constants, variables
- `Footer({ onNavigate })`
- `handleNavigate(e, href)`

#### How it communicates with other files
- Calls `onNavigate?.(href)` when a footer anchor link is clicked.

---

### 4.13 [src/components/TransitionOverlay.jsx](src/components/TransitionOverlay.jsx)

#### Why this file exists
Displays a loading-style overlay during view transitions.

#### Why it is placed in this folder
It is a reusable UI layer for the application shell.

#### When this file gets executed or imported
Imported by [src/App.jsx](src/App.jsx) and shown during transitions.

#### Responsibilities
- Provide a visual transition effect between views.

---

### 4.14 [src/components/Panel.jsx](src/components/Panel.jsx)

#### Why this file exists
Represents a generic panel component that may support a dashboard-style layout.

#### Why it is placed in this folder
It belongs in the component library for reusable layout composition.

#### When this file gets executed or imported
Not currently used by the main application flow in the files inspected here.

#### Responsibilities
- Present panel-based UI blocks.

---

### 4.15 [src/components/Reveal.jsx](src/components/Reveal.jsx)

#### Why this file exists
Wraps children in a reveal-on-scroll animation for landing sections.

#### Why it is placed in this folder
It is a reusable animation helper component.

#### When this file gets executed or imported
Used by section components like [src/components/FAQ.jsx](src/components/FAQ.jsx) or others in the landing page.

#### Responsibilities
- Animate elements into view as they appear.

---

### 4.16 [src/components/IndexGrid.jsx](src/components/IndexGrid.jsx)

#### Why this file exists
Renders the animated index grid inside the hero section.

#### Why it is placed in this folder
It is part of the hero visual composition.

#### When this file gets executed or imported
Imported by [src/components/Hero.jsx](src/components/Hero.jsx).

#### Responsibilities
- Render the grid of codebase nodes.

---

### 4.17 [src/components/IndexVisualizer.jsx](src/components/IndexVisualizer.jsx)

#### Why this file exists
Provides a visualization layer for indexed code and retrieval state.

#### Why it is placed in this folder
It is a visual component for the landing experience.

#### When this file gets executed or imported
It is not used by the main active flow in the inspected files, but it exists as a reusable visualization component.

#### Responsibilities
- Visualize indexing or retrieval structure.

---

### 4.18 [src/components/TopBar.jsx](src/components/TopBar.jsx)

#### Why this file exists
Likely supports a top bar UI, though it is not part of the current flow in the inspected files.

#### Why it is placed in this folder
It is a reusable component.

#### Responsibilities
- Provide a top bar interface.

---

## 5. View-level breakdown

### 5.1 [src/views/AuthView.jsx](src/views/AuthView.jsx)

#### Why this file exists
Handles the authentication UI and login/signup form.

#### Why it is placed in this folder
It is in `views` because it represents a full screen experience rather than a small reusable widget.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx) when the `view` state is `auth`.

#### Which files it imports
- [src/context/AppContext.jsx](src/context/AppContext.jsx)
- [src/api/client.js](src/api/client.js)
- [src/views/AuthView.css](src/views/AuthView.css)

#### Responsibilities
- Show either login or signup mode.
- Collect email/password input.
- Call the backend API to log in or register.
- Trigger `onSuccess` when login succeeds.
- Trigger `onBack` when the user wants to leave auth.

#### Functions, constants, variables
- `AuthView({ onSuccess, onBack })`
- `handleSubmit(e)`
- `mode`
- `email`
- `password`
- `status`
- `loading`

#### How it communicates with other files
- Reads `api` and `login` methods from context.
- Calls `onSuccess` and `onBack` props to notify [src/App.jsx](src/App.jsx).

#### Data flow
- Input: user input from the form.
- Output: auth request and eventual transition to dashboard.

---

### 5.2 [src/views/DashboardView.jsx](src/views/DashboardView.jsx)

#### Why this file exists
Provides the main dashboard experience for uploading files, asking questions, generating viva questions, and checking session status.

#### Why it is placed in this folder
It is a full-page experience and belongs in `views`.

#### When this file gets executed or imported
Rendered by [src/App.jsx](src/App.jsx) when the app view is `dashboard`.

#### Which files it imports
- [src/components/Sidebar.jsx](src/components/Sidebar.jsx)
- [src/api/client.js](src/api/client.js)
- [src/context/AppContext.jsx](src/context/AppContext.jsx)
- [src/views/DashboardView.css](src/views/DashboardView.css)

#### Responsibilities
- Compose the dashboard UI.
- Provide interactive panels for upload, ask, viva, and session status.
- Call the backend API for each operation.
- Report loading and result states.

#### Important functions
- `UploadPanel({ api })`
- `addFiles(fileList)`
- `removeFile(name, size)`
- `handleUpload()`
- `AskPanel({ api })`
- `handleAsk(e)`
- `VivaPanel({ api })`
- `genQuestions()`
- `fetchAnswers()`
- `StatusPanel({ api, onSessionChange })`
- `refresh()`
- `DashboardView({ onAuthNav })`
- `handleLogout()`

#### Data flow
- Input: file selection, text queries, button actions.
- Output: backend requests and rendered responses.

---

### 5.3 [src/components/Sidebar.jsx](src/components/Sidebar.jsx)

#### Why this file exists
Provides navigation within the dashboard via sidebar links and buttons.

#### Why it is placed in this folder
It is a reusable dashboard UI component.

#### When this file gets executed or imported
Imported by [src/views/DashboardView.jsx](src/views/DashboardView.jsx).

#### Which files it imports
- [src/components/sidebar.css](src/components/sidebar.css)

#### Responsibilities
- Let the user jump to dashboard sections like Upload, Ask, Viva, and Session.
- Trigger auth navigation actions.

#### Functions, constants, variables
- `scrollToPanel(id)`
- `Sidebar({ onLogout, onAuthNav, email })`

---

## 6. Major workflows

### Workflow 1: App startup

1. Browser loads the app.
2. [src/main.jsx](src/main.jsx) mounts [src/App.jsx](src/App.jsx).
3. [src/App.jsx](src/App.jsx) wraps the app in `AppProvider`.
4. `AppProvider` creates an API client through [src/api/client.js](src/api/client.js).
5. The `Shell` component initializes state.
6. The landing page is rendered.

### Workflow 2: Landing-page navigation

1. The user clicks a nav or footer link.
2. [src/components/Nav.jsx](src/components/Nav.jsx) or [src/components/Footer.jsx](src/components/Footer.jsx) prevents the default anchor jump and routes the request.
3. The handler calls `onNavigate` or `onNavigate?.(href)`.
4. [src/App.jsx](src/App.jsx) stores the pending anchor and switches the view to `landing` if needed.
5. The `pendingAnchor` effect scrolls the matching section into view.
6. The URL hash is updated.

### Workflow 3: Auth flow

1. The user clicks the primary CTA or the compact nav CTA.
2. [src/App.jsx](src/App.jsx) calls `goTo('auth')`.
3. The auth component [src/views/AuthView.jsx](src/views/AuthView.jsx) is rendered.
4. The user submits credentials.
5. `AuthView` uses the API client from context to call the backend.
6. On success, `onSuccess` transitions to `dashboard`.

### Workflow 4: Dashboard workflow

1. The app transitions to the dashboard view.
2. [src/views/DashboardView.jsx](src/views/DashboardView.jsx) renders panels.
3. Upload panel collects files and calls the upload endpoint.
4. Ask panel sends a query to the ask endpoint.
5. Viva panel generates and fetches viva questions/answers.
6. Status panel asks the backend for session status.

### Workflow 5: Section scrolling and history

1. A hash link is clicked.
2. The app captures the target via `pendingAnchor`.
3. The shell uses `window.history.pushState` or `replaceState` to update the URL.
4. The relevant section element is found by ID and scrolled into view.

## 7. Important architectural takeaways

- The frontend is a state-based SPA without a router library.
- Navigation is implemented manually through state and hash-based scroll logic.
- The app uses context for shared auth and API state.
- The landing page is composition-heavy; the dashboard is a panel-based experience.
- UI content is stored in data modules rather than embedded directly in components.
- The backend API is wrapped in a thin client to keep the UI layer clean.

## 8. Practical debugging guide

When a navigation issue occurs, the most likely files to inspect are:

- [src/App.jsx](src/App.jsx) for view transitions and pending anchor handling
- [src/components/Nav.jsx](src/components/Nav.jsx) for header navigation behavior
- [src/components/Footer.jsx](src/components/Footer.jsx) for footer links
- [src/components/Sidebar.jsx](src/components/Sidebar.jsx) for dashboard section jumping
- [src/components/Hero.jsx](src/components/Hero.jsx) for hero CTA targets

When an auth issue occurs, inspect:

- [src/views/AuthView.jsx](src/views/AuthView.jsx)
- [src/context/AppContext.jsx](src/context/AppContext.jsx)
- [src/api/client.js](src/api/client.js)

When a dashboard issue occurs, inspect:

- [src/views/DashboardView.jsx](src/views/DashboardView.jsx)
- [src/components/Sidebar.jsx](src/components/Sidebar.jsx)
- [src/api/client.js](src/api/client.js)
