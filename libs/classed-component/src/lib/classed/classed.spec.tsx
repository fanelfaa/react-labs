import { render, screen } from '@testing-library/react';

import { classed } from './classed';

const Classed = classed("div", "base-class")
describe('Classed', () => {
  it('should render classs successfully', () => {
    render(<Classed>Test Element</Classed>)
    const elWithClassName = screen.getByText(/test element/i);
    expect(elWithClassName).toBeTruthy();
    expect(elWithClassName.className).toEqual("base-class");
  });

  it('should render attribute successfully', () => {
    const testId = "test-element-id"
    render(<Classed data-testid={testId}>Test Element</Classed>)
    const elWithClassName = screen.getByTestId(testId);
    expect(elWithClassName).toBeTruthy();
    expect(elWithClassName.className).toEqual("base-class");
  });
});
