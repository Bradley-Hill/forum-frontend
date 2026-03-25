import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Alert from '../../src/components/Shared/Alert';

describe('Alert', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('displays message', () => {
    const { container, cleanup } = render(<Alert message="Test" />);
    expect(container.textContent).toContain('Test');
    cleanup();
  });

  it('has alert role for error type', () => {
    const { container, cleanup } = render(<Alert type="error" message="E" />);
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
    cleanup();
  });

  it('has status role for info type', () => {
    const { container, cleanup } = render(<Alert type="info" message="I" />);
    expect(container.querySelector('[role="status"]')).toBeTruthy();
    cleanup();
  });

  it('applies type class', () => {
    const { container, cleanup } = render(<Alert type="success" message="S" />);
    expect(container.querySelector('[class*="alert--"]')).toBeTruthy();
    cleanup();
  });

  it('shows close button when closeable', () => {
    const { container, cleanup } = render(<Alert message="M" closeable={true} />);
    expect(container.querySelector('button')).toBeTruthy();
    cleanup();
  });

  it('does not show close button by default', () => {
    const { container, cleanup } = render(<Alert message="M" closeable={false} />);
    const buttons = Array.from(container.querySelectorAll('button'));
    const closeButtons = buttons.filter(b => b.textContent?.includes('close'));
    expect(closeButtons.length).toBe(0);
    cleanup();
  });
});
