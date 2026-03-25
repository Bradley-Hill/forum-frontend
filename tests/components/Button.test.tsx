import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Button from '../../src/components/Shared/Button';

describe('Button', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('renders text', () => {
    const { container, cleanup } = render(<Button>Click</Button>);
    expect(container.textContent).toBe('Click');
    cleanup();
  });

  it('applies variant', () => {
    const { container, cleanup } = render(<Button variant="primary">Test</Button>);
    expect(container.querySelector('button')?.classList.contains('btn--primary')).toBe(true);
    cleanup();
  });

  it('applies size', () => {
    const { container, cleanup } = render(<Button size="large">Test</Button>);
    expect(container.querySelector('button')?.classList.contains('btn--large')).toBe(true);
    cleanup();
  });

  it('sets disabled', () => {
    const { container, cleanup } = render(<Button disabled>Test</Button>);
    expect((container.querySelector('button') as HTMLButtonElement)?.disabled).toBe(true);
    cleanup();
  });

  it('merges className', () => {
    const { container, cleanup } = render(<Button className="custom">Test</Button>);
    expect(container.querySelector('button')?.classList.contains('custom')).toBe(true);
    cleanup();
  });
});
