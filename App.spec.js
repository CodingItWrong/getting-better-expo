import {render, screen} from '@testing-library/react-native';
import React from 'react';
import App from './App';

describe('App', () => {
  it('renders a hello message', () => {
    render(<App />);
    expect(screen.queryByText('Hello, React Native!')).not.toBeNull();
  });
});
