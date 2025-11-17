import { render } from '@testing-library/react';
import TerminationConfirmModal from './TerminationConfirmModal';

describe('TerminationConfirmModal', () => {
  it('renders termination confirm modal', () => {
    const mockStaff = { salary: 1000, name: 'Test Staff', role: 'Manager', tier: 'A' };
    const { container } = render(
      <TerminationConfirmModal open={true} onClose={() => {}} staff={mockStaff} onCancel={() => {}} />
    );
    expect(container).toBeTruthy();
  });
});
