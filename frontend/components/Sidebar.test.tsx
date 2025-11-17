import { render } from '@testing-library/react';
import Sidebar from './Sidebar';

import { ThemeProvider } from '../contexts/ThemeContext';
import React from 'react';

describe('Sidebar', () => {
  it('renders sidebar', () => {
    const { container } = render(
      <ThemeProvider>
        <Sidebar />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });
});
