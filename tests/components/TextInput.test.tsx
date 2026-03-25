import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import TextInput from '../../src/components/Shared/TextInput';

describe('TextInput', () => {
  const render = (el: React.ReactElement) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    flushSync(() => createRoot(container).render(el));
    return { container, cleanup: () => container.remove() };
  };

  it('renders label', () => {
    const { container, cleanup } = render(
      <TextInput id="test" label="Email" value="" onChange={() => {}} />
    );
    expect(container.textContent).toContain('Email');
    cleanup();
  });

  it('renders input', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} />
    );
    expect(container.querySelector('input')).toBeTruthy();
    cleanup();
  });

  it('sets type', () => {
    const { container, cleanup } = render(
      <TextInput id="test" type="email" value="" onChange={() => {}} />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.type).toBe('email');
    cleanup();
  });

  it('sets value', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="test" onChange={() => {}} />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.value).toBe('test');
    cleanup();
  });

  it('displays error', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} error="Error!" />
    );
    expect(container.textContent).toContain('Error!');
    cleanup();
  });

  it('sets aria-invalid on error', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} error="E" />
    );
    expect(container.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
    cleanup();
  });

  it('displays helper text', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} helperText="Help" />
    );
    expect(container.textContent).toContain('Help');
    cleanup();
  });

  it('hides helper on error', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} helperText="Help" error="E" />
    );
    expect(container.querySelector('.text-input-helper')).toBeFalsy();
    cleanup();
  });

  it('shows required indicator', () => {
    const { container, cleanup } = render(
      <TextInput id="test" label="Name" value="" onChange={() => {}} required />
    );
    expect(container.textContent).toContain('*');
    cleanup();
  });

  it('sets disabled', () => {
    const { container, cleanup } = render(
      <TextInput id="test" value="" onChange={() => {}} disabled />
    );
    expect((container.querySelector('input') as HTMLInputElement)?.disabled).toBe(true);
    cleanup();
  });
});
