import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContentWrapper } from './content-wrapper';

describe('ContentWrapper', () => {
  it('renders children correctly', () => {
    render(
      <ContentWrapper>
        <p>Test content</p>
      </ContentWrapper>
    );
    const content = screen.getByText('Test content');
    expect(content).toBeInTheDocument();
  });

  it('applies base styling classes', () => {
    const { container } = render(
      <ContentWrapper>
        <p>Test content</p>
      </ContentWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mx-auto');
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('max-w-[600px]');
  });

  it('merges custom className when provided', () => {
    const { container } = render(
      <ContentWrapper className="custom-class">
        <p>Test content</p>
      </ContentWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveClass('mx-auto');
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('max-w-[600px]');
  });

  it('renders as a div element', () => {
    const { container } = render(
      <ContentWrapper>
        <p>Test content</p>
      </ContentWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
  });

  it('renders multiple children correctly', () => {
    render(
      <ContentWrapper>
        <p>First child</p>
        <span>Second child</span>
      </ContentWrapper>
    );
    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
  });
});
