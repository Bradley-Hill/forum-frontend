import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Form from '../../src/components/Shared/Form';

describe('Form', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('renders form', () => {
    const { container, cleanup } = render(
      <Form onSubmit={() => {}}><input /></Form>
    );
    expect(container.querySelector('form')).toBeTruthy();
    cleanup();
  });

  it('renders children', () => {
    const { container, cleanup } = render(
      <Form onSubmit={() => {}}>
        <div>Test</div>
      </Form>
    );
    expect(container.textContent).toContain('Test');
    cleanup();
  });

  it('applies className', () => {
    const { container, cleanup } = render(
      <Form onSubmit={() => {}} className="custom">
        <input />
      </Form>
    );
    expect(container.querySelector('form')?.classList.contains('custom')).toBe(true);
    cleanup();
  });

  it('has noValidate set', () => {
    const { container, cleanup } = render(
      <Form onSubmit={() => {}}>
        <input />
      </Form>
    );
    expect((container.querySelector('form') as HTMLFormElement)?.noValidate).toBe(true);
    cleanup();
  });
});
