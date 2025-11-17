import { render } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard', () => {
    const mockDate = { year: 1, month: 1, week: 1 };
    const mockStats = { cash: 1000, fame: 50, wellBeing: 80, careerProgress: 10, hype: 5 };
    const { container } = render(<Dashboard date={mockDate} stats={mockStats} />);
    expect(container).toBeTruthy();
  });
});
