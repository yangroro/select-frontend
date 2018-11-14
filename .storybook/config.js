import { configure } from '@storybook/react';

const req = require.context('../src/app', true, /__stories.tsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
