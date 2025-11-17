import { render } from '@testing-library/react';
import ScenarioCard from './ScenarioCard';

describe('ScenarioCard', () => {
  it('renders scenario card', () => {
    const mockDifficulty = 'beginner';
    const mockScenario = {
      title: 'Test Scenario',
      choices: [
        { text: 'Choice 1', outcome: { cash: 100, fame: 10, wellBeing: 5 } },
        { text: 'Choice 2', outcome: { cash: 50, fame: 5, wellBeing: 2 } }
      ]
    };
    const { container } = render(<ScenarioCard difficulty={mockDifficulty} scenario={mockScenario} />);
    expect(container).toBeTruthy();
  });
});
