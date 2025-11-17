import { render } from '@testing-library/react';
import AlertDialog from './AlertDialog';

describe('AlertDialog', () => {
  it('renders alert dialog', () => {
    const { container } = render(<AlertDialog open={true} onClose={() => {}} />);
    expect(container).toBeTruthy();
  });
});
