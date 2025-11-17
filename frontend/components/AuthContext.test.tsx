import { render } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import React from 'react';

describe('AuthProvider', () => {
  it('renders children', () => {
    const Child = () => <div>child</div>;
    const { getByText } = render(
      <AuthProvider>
        <Child />
      </AuthProvider>
    );
    expect(getByText('child')).toBeTruthy();
  });
});
