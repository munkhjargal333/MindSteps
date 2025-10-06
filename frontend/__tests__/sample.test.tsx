import { render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom';



test('sample test', () => {
  render(<div>Hello MindSteps</div>)
  expect(screen.getByText('Hello MindSteps')).toBeInTheDocument()
})
