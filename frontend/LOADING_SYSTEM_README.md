# Interactive Loading Page System

A professional, interactive loading page system for React applications with multiple animation variants and global loading management.

## Features

- 🎨 **7 Loading Variants**: Default, Pulse, Spinner, Dots, Wave, Detailed, and Logo animations
- 🌐 **Global Loading State**: App-wide loading management with overlay
- 📊 **Progress Tracking**: Optional progress bar for long operations
- 🎭 **Animated Backgrounds**: Dynamic particle effects and gradient animations
- 📱 **Responsive Design**: Works on all screen sizes
- ⚡ **Performance Optimized**: Smooth 60fps animations with Framer Motion
- 🎯 **Easy Integration**: Simple hooks and components for quick implementation

## Components

### LoadingPage

The main loading component with customizable animations and messages.

```jsx
import LoadingPage from './components/LoadingPage';

<LoadingPage
  message="Loading your experience..."
  variant="detailed"
  progress={75}
  size="large"
/>
```

#### Props

- `message` (string): Loading message to display
- `variant` (string): Animation variant ('default', 'pulse', 'spinner', 'dots', 'wave', 'detailed', 'logo')
- `progress` (number): Progress percentage (0-100) for progress bar
- `size` (string): Component size ('small', 'medium', 'large')

### useLoading Hook

Local loading state management for individual components.

```jsx
import { useLoading } from './hooks/useLoading';

const MyComponent = () => {
  const loading = useLoading();

  const handleAsyncOperation = async () => {
    loading.startLoading("Processing...", "spinner");

    try {
      await someAsyncOperation();
      loading.stopLoading();
    } catch (error) {
      loading.stopLoading();
      // Handle error
    }
  };

  return (
    <div>
      {loading.isLoading && (
        <LoadingPage
          message={loading.loadingMessage}
          variant={loading.loadingVariant}
          progress={loading.loadingProgress}
        />
      )}
      {/* Your component content */}
    </div>
  );
};
```

### useGlobalLoading Hook

App-wide loading state management with automatic overlay.

```jsx
import { useGlobalLoading } from './App';

const MyComponent = () => {
  const globalLoading = useGlobalLoading();

  const handleLogin = async () => {
    globalLoading.startLoading("Signing you in...", "pulse");

    try {
      await loginAPI();
      globalLoading.stopLoading();
    } catch (error) {
      globalLoading.stopLoading();
      // Handle error
    }
  };

  // No need to render loading component - it's handled globally
  return <button onClick={handleLogin}>Login</button>;
};
```

## Loading Variants

### Default
Classic spinning loader with heart icon and subtle animations.

### Pulse
Pulsing animated icon with scaling and opacity effects.

### Spinner
Dual rotating spinners with different speeds and colors.

### Dots
Three bouncing dots with staggered animations.

### Wave
Audio-style wave bars with varying heights.

### Detailed
Step-by-step loading with icons and descriptive messages:
- Connecting to servers
- Loading data
- Securing connection
- Preparing interface
- Syncing contacts
- Launching experience

### Logo
Animated logo with glow effects and rotation.

## Predefined Configurations

The system includes predefined configurations for common loading scenarios:

```jsx
import { loadingConfigs } from './hooks/useLoading';

const globalLoading = useGlobalLoading();

// Use predefined config
globalLoading.startLoading(
  loadingConfigs.login.message,
  loadingConfigs.login.variant
);
```

Available configs:
- `initialLoad`: App initialization
- `login`: User authentication
- `register`: Account creation
- `sendingMessage`: Message sending
- `loadingChat`: Chat loading
- `connecting`: Server connection
- `uploading`: File upload
- `syncing`: Data synchronization

## Integration Examples

### Global Loading in App.jsx

```jsx
// App.jsx
import { LoadingContext } from './App';
import LoadingPage from './components/LoadingPage';

function App() {
  const loadingState = useLoading();

  return (
    <LoadingContext.Provider value={loadingState}>
      {/* Your app content */}

      {/* Global loading overlay */}
      {loadingState.isLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <LoadingPage
            message={loadingState.loadingMessage}
            progress={loadingState.loadingProgress}
            variant={loadingState.loadingVariant}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
}
```

### Suspense Fallback

```jsx
import { Suspense } from 'react';
import LoadingPage from './components/LoadingPage';

<Suspense fallback={
  <LoadingPage
    message="Loading your experience..."
    variant="detailed"
  />
}>
  <YourLazyComponent />
</Suspense>
```

### Form Submission

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  globalLoading.startLoading("Processing your request...", "spinner");

  try {
    const response = await apiCall(data);
    globalLoading.stopLoading();
    // Handle success
  } catch (error) {
    globalLoading.stopLoading();
    // Handle error
  }
};
```

## Demo Page

Visit `/loading-demo` to see all loading variants in action and test the global loading system.

## Performance Notes

- Animations are optimized for 60fps performance
- Components use CSS transforms for smooth animations
- Particle effects are limited to prevent performance issues
- Lazy loading is supported for all variants

## Customization

The loading system is highly customizable. You can:

- Create new animation variants
- Modify color schemes and gradients
- Adjust animation timings and easing
- Add custom icons and messages
- Extend the loading configurations

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Framer Motion requires React 16.8+
- ES6+ JavaScript features

## Dependencies

- React 16.8+
- Framer Motion
- Lucide React (for icons)
- Tailwind CSS (for styling)</content>
<parameter name="filePath">/workspaces/Chat_appV1.2/frontend/src/components/LoadingPage.README.md