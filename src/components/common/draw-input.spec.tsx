import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DrawInput } from './draw-input';

describe('DrawInput', () => {
  let mockToDataURL: ReturnType<typeof vi.fn>;
  let mockGetContext: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock canvas toDataURL to return a valid data URL
    mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,mockImageData');
    
    mockGetContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      lineCap: 'round',
      lineJoin: 'round',
    });

    HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as HTMLCanvasElement['getContext'];

    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
      value: mockToDataURL,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
      value: 400,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
      value: 128,
      writable: true,
      configurable: true,
    });

    // Mock Image to trigger onload immediately
    global.Image = class MockImage {
      onload: (() => void) | null = null;
      src = '';
      
      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }
    } as typeof Image;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Test Label" value="" onChange={onChange} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with label text', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Signature" value="" onChange={onChange} />);
    const label = screen.getByText('Signature');
    expect(label).toBeInTheDocument();
  });

  it('renders canvas element', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Signature" value="" onChange={onChange} />);
    const canvas = screen.getByLabelText('Signature');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('label is properly associated with canvas (accessibility)', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Signature" value="" onChange={onChange} />);
    const label = screen.getByText('Signature');
    const canvas = screen.getByLabelText('Signature');

    expect(label).toHaveAttribute('for');
    expect(canvas).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(canvas.getAttribute('id'));
  });

  it('uses custom id when provided', () => {
    const onChange = vi.fn();
    render(
      <DrawInput label="Custom ID" id="custom-canvas-id" value="" onChange={onChange} />
    );
    const canvas = screen.getByLabelText('Custom ID');
    expect(canvas).toHaveAttribute('id', 'custom-canvas-id');
  });

  it('merges custom className to container', () => {
    const onChange = vi.fn();
    render(
      <DrawInput label="Test" className="custom-container-class" value="" onChange={onChange} />
    );
    const container = screen.getByText('Test').parentElement;
    expect(container).toHaveClass('custom-container-class');
  });

  it('merges custom canvasClassName to canvas wrapper', () => {
    const onChange = vi.fn();
    const { container } = render(
      <DrawInput
        label="Test"
        canvasClassName="custom-canvas-class"
        value=""
        onChange={onChange}
      />
    );
    const canvasWrapper = container.querySelector('.custom-canvas-class');
    expect(canvasWrapper).toBeInTheDocument();
  });

  it('has white label text styling', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Styled Label" value="" onChange={onChange} />);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('text-white');
  });

  it('has white background on canvas wrapper', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Signature" value="" onChange={onChange} />);
    const canvas = screen.getByLabelText('Signature');
    const wrapper = canvas.parentElement;
    expect(wrapper).toHaveClass('bg-white');
  });

  it('has rounded-lg border on canvas wrapper', () => {
    const onChange = vi.fn();
    render(<DrawInput label="Signature" value="" onChange={onChange} />);
    const canvas = screen.getByLabelText('Signature');
    const wrapper = canvas.parentElement;
    expect(wrapper).toHaveClass('rounded-lg');
    expect(wrapper).toHaveClass('border');
  });

  describe('disabled state', () => {
    it('applies opacity-50 styling when disabled', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Disabled" disabled value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Disabled');
      expect(canvas).toHaveClass('opacity-50');
    });

    it('applies cursor-not-allowed styling when disabled', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Disabled" disabled value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Disabled');
      expect(canvas).toHaveClass('cursor-not-allowed');
    });

    it('does not trigger drawing when disabled', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Disabled" disabled value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Disabled') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not show clear button when disabled', () => {
      const onChange = vi.fn();
      render(
        <DrawInput
          label="Disabled"
          disabled
          value="data:image/png;base64,test"
          onChange={onChange}
        />
      );
      const clearButton = screen.queryByText('Clear');
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('clear functionality', () => {
    it('shows clear button when there is a drawing', async () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });
    });

    it('does not show clear button initially when no drawing', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const clearButton = screen.queryByText('Clear');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('calls onChange with empty string when clear is clicked', async () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });

      onChange.mockClear();

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('accepts custom clearButtonLabel', async () => {
      const onChange = vi.fn();
      render(
        <DrawInput
          label="Signature"
          clearButtonLabel="Reset"
          value=""
          onChange={onChange}
        />
      );
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        expect(screen.getByText('Reset')).toBeInTheDocument();
      });
    });

    it('hides clear button after clearing', async () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      });
    });
  });

  describe('pointer events', () => {
    it('calls onChange after drawing stroke (pointerUp)', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.stringContaining('data:image/png;base64,'));
    });

    it('calls onChange on pointerLeave while drawing', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerLeave(canvas);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.stringContaining('data:image/png;base64,'));
    });

    it('does not call onChange on pointerMove without pointerDown', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('handles multiple strokes', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // First stroke
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(onChange).toHaveBeenCalledTimes(1);

      // Second stroke
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 30 });
      fireEvent.pointerMove(canvas, { clientX: 40, clientY: 40 });
      fireEvent.pointerUp(canvas);

      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('touch events', () => {
    it('handles touchStart event', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 10, clientY: 10 }],
      });

      expect(canvas).toBeInTheDocument();
    });

    it('handles touchMove event', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 10, clientY: 10 }],
      });

      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 20, clientY: 20 }],
      });

      expect(canvas).toBeInTheDocument();
    });

    it('handles touchEnd event and calls onChange', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 10, clientY: 10 }],
      });

      fireEvent.touchEnd(canvas, {
        touches: [],
      });

      expect(onChange).toHaveBeenCalledWith('data:image/png;base64,mockImageData');
    });

    it('does not trigger drawing when disabled', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" disabled value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 10, clientY: 10 }],
      });

      fireEvent.touchEnd(canvas, {
        touches: [],
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled behavior', () => {
    it('renders with empty value', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toBeInTheDocument();
    });

    it('renders with provided value (data URL)', () => {
      const onChange = vi.fn();
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      render(<DrawInput label="Signature" value={dataUrl} onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toBeInTheDocument();
    });

    it('shows clear button when value is provided', async () => {
      const onChange = vi.fn();
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      render(<DrawInput label="Signature" value={dataUrl} onChange={onChange} />);

      // Wait for useEffect to load image (mocked Image triggers onload asynchronously)
      await waitFor(() => {
        const clearButton = screen.getByText('Clear');
        expect(clearButton).toBeInTheDocument();
      });
    });

    it('updates canvas when value prop changes', () => {
      const onChange = vi.fn();
      const initialValue = 'data:image/png;base64,initial';
      const updatedValue = 'data:image/png;base64,updated';

      const { rerender } = render(
        <DrawInput label="Signature" value={initialValue} onChange={onChange} />
      );

      rerender(<DrawInput label="Signature" value={updatedValue} onChange={onChange} />);

      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('optional props', () => {
    it('works without onChange prop', () => {
      render(<DrawInput label="Signature" value="" />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(canvas).toBeInTheDocument();
    });

    it('works without value prop', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      expect(onChange).toHaveBeenCalled();
    });

    it('works with minimal props (label only)', () => {
      render(<DrawInput label="Signature" />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('canvas configuration', () => {
    it('has touch-none class to prevent default touch actions', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toHaveClass('touch-none');
    });

    it('has full width styling', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toHaveClass('w-full');
    });

    it('has fixed height styling', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');
      expect(canvas).toHaveClass('h-32');
    });
  });

  describe('clear button positioning', () => {
    it('positions clear button absolutely in top-right', async () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        const clearButton = screen.getByText('Clear');
        expect(clearButton).toHaveClass('absolute');
        expect(clearButton).toHaveClass('top-2');
        expect(clearButton).toHaveClass('right-2');
      });
    });

    it('clear button has ghost variant', async () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Simulate drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      await waitFor(() => {
        const clearButton = screen.getByText('Clear');
        expect(clearButton).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles null canvas ref in handlePointerUp gracefully', () => {
      const onChange = vi.fn();
      const { container } = render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Start drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });

      // Remove canvas from DOM to simulate null ref
      canvas.remove();

      // Should not throw error
      fireEvent.pointerUp(container);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('handles null context in handleClear gracefully', async () => {
      const onChange = vi.fn();
      
      // Mock getContext to return null
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null) as unknown as HTMLCanvasElement['getContext'];

      render(<DrawInput label="Signature" value="data:image/png;base64,test" onChange={onChange} />);

      // Restore original mock
      HTMLCanvasElement.prototype.getContext = originalGetContext as unknown as HTMLCanvasElement['getContext'];

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByLabelText('Signature')).toBeInTheDocument();
      });
    });

    it('handles getContext returning null during initialization', () => {
      const onChange = vi.fn();
      
      // Mock getContext to return null
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null) as unknown as HTMLCanvasElement['getContext'];

      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature');

      expect(canvas).toBeInTheDocument();
    });

    it('handles missing canvas in handlePointerDown', () => {
      const onChange = vi.fn();
      const { container } = render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Remove canvas from DOM
      canvas.remove();

      // Should not throw error
      fireEvent.pointerDown(container);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('handles null context in handlePointerDown', () => {
      const onChange = vi.fn();
      
      // Mock getContext to return null
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null) as unknown as HTMLCanvasElement['getContext'];

      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('handles missing canvas in handlePointerMove', () => {
      const onChange = vi.fn();
      const { container } = render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Start drawing
      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });

      // Remove canvas
      canvas.remove();

      // Should not throw error
      fireEvent.pointerMove(container, { clientX: 20, clientY: 20 });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('handles null context in handlePointerMove', () => {
      const onChange = vi.fn();
      
      // Setup mock context that will be returned initially
      const mockContext = {
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        scale: vi.fn(),
        drawImage: vi.fn(),
        strokeStyle: '',
        lineWidth: 0,
        lineCap: 'round',
        lineJoin: 'round',
      };

      let callCount = 0;
      HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => {
        callCount++;
        // Return null on third call (during handlePointerMove)
        return callCount === 3 ? null : mockContext;
      }) as unknown as HTMLCanvasElement['getContext'];

      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 });
      fireEvent.pointerUp(canvas);

      // Should have been called during pointerUp (before context became null)
      expect(onChange).toHaveBeenCalled();
    });

    it('handles missing touches array in touch event', () => {
      const onChange = vi.fn();
      render(<DrawInput label="Signature" value="" onChange={onChange} />);
      const canvas = screen.getByLabelText('Signature') as HTMLCanvasElement;

      // Touch event without touches array
      fireEvent.touchStart(canvas, { touches: [] });
      fireEvent.touchEnd(canvas, { touches: [] });

      expect(canvas).toBeInTheDocument();
    });
  });
});
