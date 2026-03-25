import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
export const render = (component: React.ReactElement) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => root.render(component));
  
  return {
    container,
    cleanup: () => {
      root.unmount();
      container.remove();
    },
  };
};

