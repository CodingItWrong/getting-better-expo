import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];

  describe('when restaurants are available', () => {
    it('displays the restaurant names', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).toBeTruthy();
      expect(screen.queryByText(restaurants[1].name)).toBeTruthy();
    });
  });

  describe('when there is a load error', () => {
    it('displays an error message', () => {
      render(<RestaurantList loadError />);

      expect(
        screen.queryByText('An error occurred while loading the restaurants'),
      ).toBeTruthy();
    });
  });
});
