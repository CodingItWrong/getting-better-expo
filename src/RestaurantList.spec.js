import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

describe('RestaurantList', () => {
  describe('when loading succeeds', () => {
    it('renders restaurants from the server', () => {
      const restaurants = [
        {id: 1, name: 'Pizza Place'},
        {id: 2, name: 'Salad Place'},
      ];

      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();
    });
  });

  describe('when loading fails', () => {
    it('renders an error message', () => {
      render(<RestaurantList loadError />);

      expect(
        screen.queryByText('An error occurred loading restaurants'),
      ).not.toBeNull();
    });
  });
});
