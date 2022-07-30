import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();
    });
  });
});
