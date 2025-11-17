import { render } from '@testing-library/react';
import StatisticsPanel from './StatisticsPanel';

describe('StatisticsPanel', () => {
  it('renders statistics panel', () => {
    const mockState = {
      statistics: {},
      currentDate: new Date(),
      startDate: new Date(),
      currentHistory: [{ cash: 100 }],
      playerStats: { cash: 100 },
    };
    const { container } = render(<StatisticsPanel state={mockState} />);
    expect(container).toBeTruthy();
  });
});
