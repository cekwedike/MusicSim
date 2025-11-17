import { render } from '@testing-library/react';
import SaveLoadPanel from './SaveLoadPanel';

describe('SaveLoadPanel', () => {
  it('renders save/load panel', () => {
    const { container } = render(<SaveLoadPanel />);
    expect(container).toBeTruthy();
  });
});
