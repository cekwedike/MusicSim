import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

// Lightweight error boundary that prevents audio-related errors from crashing the app.
export default class AudioErrorBoundary extends React.Component<Props, State> {
  // satisfy TypeScript instance checking for props/state
  public props!: Props;
  public state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Log the error so we can inspect later; don't rethrow
    // eslint-disable-next-line no-console
    console.error('[AudioErrorBoundary] Caught error in audio component:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Fail gracefully - render nothing where audio would be
      return null;
    }
    return this.props.children;
  }
}
