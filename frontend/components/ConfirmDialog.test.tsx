import { render } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders confirm dialog', () => {
    const { container } = render(<ConfirmDialog open={true} onClose={() => {}} />);
    expect(container).toBeTruthy();
  });
});
