import React from 'react';
import { render, screen } from '@testing-library/react';
import Terminal from '.';

test('组件正常渲染', () => {
  render(<Terminal />);
  const linkElement = screen.getByText('[local]:');
  expect(linkElement).toBeInTheDocument();
});
