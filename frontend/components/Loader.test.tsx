import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders loader spinner', () => {
    const { container } = render(<Loader loading={true} />);
    expect(container).toBeTruthy();
  });
});
