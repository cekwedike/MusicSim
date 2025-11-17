import { render } from '@testing-library/react';
import StaffTerminationModal from './StaffTerminationModal';

describe('StaffTerminationModal', () => {
  it('renders staff termination modal', () => {
    const mockStaff = { name: 'Test Staff', role: 'Manager', tier: 'A', salary: 1000 };
    const mockOutcome = { message: 'Termination successful.', severance: 2000 };
    const { container } = render(
      <StaffTerminationModal open={true} onClose={() => {}} staff={mockStaff} outcome={mockOutcome} />
    );
    expect(container).toBeTruthy();
  });
});
