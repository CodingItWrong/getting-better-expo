import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];
  const loadingMessage = 'Loading…';
  const errorMessage = 'An error occurred loading restaurants';

  describe('while loading', () => {
    it('shows a loading indicator', () => {
      render(<RestaurantList loading />);

      expect(screen.queryByText(loadingMessage)).toBeTruthy();
    });
  });

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).toBeTruthy();
      expect(screen.queryByText(restaurants[1].name)).toBeTruthy();

      expect(screen.queryByText(loadingMessage)).toBeNull();
      expect(screen.queryByText(errorMessage)).toBeNull();
    });
  });

  describe('when loading fails', () => {
    it('renders an error message', () => {
      render(<RestaurantList loadError />);

      expect(screen.queryByText(errorMessage)).toBeTruthy();

      expect(screen.queryByText(loadingMessage)).toBeNull();
    });
  });
});
