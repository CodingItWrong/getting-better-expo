import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];
  const loadErrorMessage = 'An error occurred while loading the restaurants';

  describe('when restaurants are available', () => {
    it('displays the restaurant names', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).toBeTruthy();
      expect(screen.queryByText(restaurants[1].name)).toBeTruthy();

      expect(screen.queryByText(loadErrorMessage)).toBeNull();
    });
  });

  describe('when there is a load error', () => {
    it('displays an error message', () => {
      render(<RestaurantList loadError />);

      expect(screen.queryByText(loadErrorMessage)).toBeTruthy();
    });
  });
});
