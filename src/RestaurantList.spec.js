import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';
import api from './api';

jest.mock('./api');

describe('RestaurantList', () => {
  describe('when loading succeeds', () => {
    it('renders restaurants from the server', async () => {
      const restaurants = [
        {id: 1, name: 'Pizza Place'},
        {id: 2, name: 'Salad Place'},
      ];

      api.get.mockResolvedValue({data: restaurants});

      render(<RestaurantList />);

      await screen.findByText(restaurants[0].name);
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();
    });
  });
});
