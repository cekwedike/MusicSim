import { render } from '@testing-library/react';
import OutcomeModal from './OutcomeModal';

describe('OutcomeModal', () => {
  it('renders outcome modal', () => {
    const mockOutcome = { cash: 100, fame: 10, wellBeing: 5, careerProgress: 2, hype: 1 };
    const { container } = render(
      <OutcomeModal open={true} outcome={mockOutcome} onClose={() => {}} />
    );
    expect(container).toBeTruthy();
  });
});
