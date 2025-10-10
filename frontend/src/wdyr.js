// src/wdyr.js
import React from 'react';

// Vite uses import.meta.env.DEV instead of process.env.NODE_ENV
if (import.meta.env.DEV) {
  const whyDidYouRender = (await import('@welldone-software/why-did-you-render')).default;
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOwnerReasons: true,
    collapseGroups: true,
    include: [/^./], // Include all components
    exclude: [/^Route/, /^Link/, /^Nav/], // Exclude router components if you have them
  });
}