import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import PasswordInput from '../../src/components/Shared/PasswordInput';

describe('PasswordInput', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('renders password input', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" value="" onChange={() => {}} />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.type).toBe('password');
    cleanup();
  });

  it('renders with label', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" label="Password" value="" onChange={() => {}} />
    );
    expect(container.textContent).toContain('Password');
    cleanup();
  });

  it('sets value', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" value="secret" onChange={() => {}} />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.value).toBe('secret');
    cleanup();
  });

  it('displays error', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" value="" onChange={() => {}} error="Weak" />
    );
    expect(container.textContent).toContain('Weak');
    cleanup();
  });

  it('sets disabled', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" value="" onChange={() => {}} disabled />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.disabled).toBe(true);
    cleanup();
  });

  it('has toggle button', () => {
    const { container, cleanup } = render(
      <PasswordInput id="pwd" value="" onChange={() => {}} />
    );
    expect(container.querySelector('button')).toBeTruthy();
    cleanup();
  });
});
