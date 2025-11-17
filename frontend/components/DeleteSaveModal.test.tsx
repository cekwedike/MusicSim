import { render } from '@testing-library/react';
import DeleteSaveModal from './DeleteSaveModal';

describe('DeleteSaveModal', () => {
  it('renders delete save modal', () => {
    const { container } = render(<DeleteSaveModal open={true} onClose={() => {}} />);
    expect(container).toBeTruthy();
  });
});
