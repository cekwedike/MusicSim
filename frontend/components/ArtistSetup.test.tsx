import { render } from '@testing-library/react';
import ArtistSetup from './ArtistSetup';

import { AuthProvider } from '../contexts/AuthContext';
import React from 'react';

describe('ArtistSetup', () => {
  it('renders artist setup', () => {
    const { container } = render(
      <AuthProvider>
        <ArtistSetup />
      </AuthProvider>
    );
    expect(container).toBeTruthy();
  });
});
