import { render } from '@testing-library/react';
import ProfilePanel from './ProfilePanel';

import { AuthProvider } from '../contexts/AuthContext';
import React from 'react';

describe('ProfilePanel', () => {
  it('renders profile panel', () => {
    const { container } = render(
      <AuthProvider>
        <ProfilePanel />
      </AuthProvider>
    );
    expect(container).toBeTruthy();
  });
});
