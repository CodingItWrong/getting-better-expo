import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';
import api from './api';

jest.mock('./api');

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];

  describe('while loading', () => {
    it('shows a loading indicator', async () => {
      const neverSettles = new Promise(() => {});
      api.get.mockReturnValue(neverSettles);

      render(<RestaurantList />);

      expect(screen.queryByText('Loading…')).not.toBeNull();
    });
  });

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', async () => {
      api.get.mockResolvedValue({data: restaurants});

      render(<RestaurantList />);

      await screen.findByText(restaurants[0].name);
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    it('renders an error message', async () => {
      api.get.mockRejectedValue();

      render(<RestaurantList />);

      await screen.findByText('An error occurred loading restaurants');

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });
});
