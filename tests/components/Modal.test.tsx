import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Modal from '../../src/components/Shared/Modal';

describe('Modal', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('does not render when closed', () => {
    const { container, cleanup } = render(
      <Modal isOpen={false} onClose={() => {}}>Content</Modal>
    );
    expect(container.querySelector('[role="dialog"]')).toBeFalsy();
    cleanup();
  });

  it('renders when open', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}}>Content</Modal>
    );
    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    cleanup();
  });

  it('displays content', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}}>Test</Modal>
    );
    expect(container.textContent).toContain('Test');
    cleanup();
  });

  it('has dialog role', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}}>C</Modal>
    );
    expect(container.querySelector('[role="dialog"]')?.getAttribute('role')).toBe('dialog');
    cleanup();
  });

  it('has aria-modal', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}}>C</Modal>
    );
    expect(container.querySelector('[aria-modal]')?.getAttribute('aria-modal')).toBe('true');
    cleanup();
  });

  it('displays title', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">C</Modal>
    );
    expect(container.textContent).toContain('Modal Title');
    cleanup();
  });

  it('applies size class', () => {
    const { container, cleanup } = render(
      <Modal isOpen={true} onClose={() => {}} size="large">C</Modal>
    );
    expect(container.querySelector('[class*="large"]')).toBeTruthy();
    cleanup();
  });
});
