import { render } from '@testing-library/react';
import LandingPage from './LandingPage';

import { ThemeProvider } from '../contexts/ThemeContext';
import React from 'react';

describe('LandingPage', () => {
  it('renders landing page', () => {
    const { container } = render(
      <ThemeProvider>
        <LandingPage />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });
});
