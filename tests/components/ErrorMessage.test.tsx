import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import ErrorMessage from '../../src/components/Shared/ErrorMessage';

describe('ErrorMessage', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('displays message', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="Error!" />
    );
    expect(container.textContent).toContain('Error!');
    cleanup();
  });

  it('displays error code', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" code="ERR_001" />
    );
    expect(container.textContent).toContain('ERR_001');
    cleanup();
  });

  it('has alert role', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" />
    );
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
    cleanup();
  });

  it('displays details when provided', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" details="Details here" showDetails={true} />
    );
    expect(container.textContent).toContain('Details here');
    cleanup();
  });

  it('has details toggle button', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" details="D" />
    );
    expect(container.querySelector('[aria-expanded]')).toBeTruthy();
    cleanup();
  });

  it('shows retry button when provided', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" onRetry={() => {}} />
    );
    expect(container.querySelector('button')).toBeTruthy();
    cleanup();
  });

  it('applies custom className', () => {
    const { container, cleanup } = render(
      <ErrorMessage message="E" className="custom" />
    );
    expect(container.querySelector('[class*="custom"]')).toBeTruthy();
    cleanup();
  });
});
