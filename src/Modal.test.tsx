import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Modal from './Modal';

describe('Modal component', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  const mockGetBoundingClientRect = jest.fn(() => ({
    top: 100,
    left: 100,
    width: 200,
    height: 150,
    x: 100,
    y: 100,
    bottom: 250,
    right: 300,
    toJSON: jest.fn(),
  }));

  beforeEach(() => {
    // Mocking getBoundingClientRect on the prototype of HTMLElement
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });

  afterEach(() => {
    // Cleaning up mock function after each test
    mockGetBoundingClientRect.mockClear();
  });

  // Mock the close method of useRef
  const mockedDialogRefClose = jest.fn();

  jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useRef: jest.fn(() => ({
      current: {
        close: mockedDialogRefClose // Assign the mocked close method
      }
    }))
  }));

  jest.useFakeTimers();

  it('renders the close icon, by default', () => {
    const { container } = render(
      <Modal />
    );

    const svgEl = container.querySelector('svg') as SVGSVGElement;

    expect(svgEl).toBeInTheDocument();
  });

  it('does not render the close icon, when showCloseIcon is falsy', () => {
    const { container } = render(
      <Modal showCloseIcon={false} />
    );

    const svgEl = container.querySelector('svg') as SVGSVGElement;

    expect(svgEl).not.toBeInTheDocument();
  });

  it('calls onOpen when open is true', () => {
    const handleOpen = jest.fn();
    render(<Modal onOpen={handleOpen} open />);
    expect(handleOpen).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    const { getByText } = render(<Modal onClose={handleClose} showCloseButton />);
    fireEvent.click(getByText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders children when provided', () => {
    const { getByText } = render(
      <Modal>
        <div>Test Content</div>
      </Modal>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('closes when the Escape key is clicked', () => {
    const handleClose = jest.fn();

    const { getByRole } = render(<Modal onClose={handleClose} />);
    const backdrop = getByRole('dialog', { hidden: true });

    fireEvent.keyDown(backdrop, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalled();
  });

  it("should call setTimeout when close button is clicked", () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    const { getByText } = render(<Modal showCloseButton />);

    // Trigger click on the close button
    fireEvent.click(getByText("Close"));

    // Advance timers
    jest.runAllTimers();

    // Assert that setTimeout is called
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 300);

    // Clean up
    setTimeoutSpy.mockRestore();
  });

  it('does not close the dialog when clicked outside of the backdrop', async () => {
    const { getByRole } = render(<Modal />);
    const backdrop = getByRole('dialog', { hidden: true });
    fireEvent.click(backdrop);

    expect(backdrop).toBeInTheDocument();
  });

  it('Closes the dialog when clicked outside of the backdrop', () => {
    const handleClose = jest.fn();
    const { getByRole } = render(<Modal onClose={handleClose} />);
    const backdrop = getByRole('dialog', { hidden: true });

    // Simulate a click event outside the dialog
    fireEvent.click(backdrop, { clientX: 0, clientY: 0 });

    expect(handleClose).toHaveBeenCalled();
  });
});
