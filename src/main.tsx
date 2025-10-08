import React from 'react';
import { render } from 'ink';
import { App } from './ui/App';

// Handle process exit gracefully for external signals
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Render the application with safe input settings
render(<App />, {
  // Let Ink handle Ctrl+C to exit immediately
  exitOnCtrlC: true
});
