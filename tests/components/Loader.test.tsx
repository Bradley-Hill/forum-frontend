import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Loader from '../../src/components/Shared/Loader';

describe('Loader', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('renders', () => {
    const { container, cleanup } = render(<Loader />);
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy();
    cleanup();
  });

  it('has aria-busy', () => {
    const { container, cleanup } = render(<Loader />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    cleanup();
  });

  it('applies size class', () => {
    const { container, cleanup } = render(<Loader size="large" />);
    expect(container.querySelector('[class*="large"]')).toBeTruthy();
    cleanup();
  });

  it('displays message', () => {
    const { container, cleanup } = render(<Loader message="Loading..." />);
    expect(container.textContent).toContain('Loading...');
    cleanup();
  });

  it('applies fullscreen class', () => {
    const { container, cleanup } = render(<Loader fullScreen />);
    expect(container.querySelector('[class*="full-screen"]')).toBeTruthy();
    cleanup();
  });

  it('merges className', () => {
    const { container, cleanup } = render(<Loader className="custom" />);
    expect(container.querySelector('[class*="custom"]')).toBeTruthy();
    cleanup();
  });
});
