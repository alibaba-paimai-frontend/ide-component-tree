import * as React from 'react';
import { render } from 'react-dom';
import Hello from './components/Hello';

render(
  <Hello name="TypeScript" enthusiasmLevel={10} />,
  document.getElementById('example') as HTMLElement
);
