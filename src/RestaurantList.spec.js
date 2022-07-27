import {
  fireEvent,
  render,
  screen,
  waitFor,
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
    it('shows a loading indicator', () => {
      render(<RestaurantList loading />);

      expect(screen.queryByText('Loading…')).not.toBeNull();
    });
  });

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    it('renders an error message', () => {
      render(<RestaurantList loadError />);

      expect(
        screen.queryByText('An error occurred loading restaurants'),
      ).not.toBeNull();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when adding a restaurant succeeds', () => {
    const name = 'Burger Place';

    it('clears the new restaurant name field', async () => {
      api.post.mockResolvedValue();

      const reloadRestaurants = jest
        .fn()
        .mockName('reloadRestaurants')
        .mockResolvedValue();

      render(
        <RestaurantList
          restaurants={[]}
          reloadRestaurants={reloadRestaurants}
        />,
      );

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        name,
      );
      fireEvent.press(screen.getByText('Add'));

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});

      await waitFor(() =>
        expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
          'value',
          '',
        ),
      );

      expect(reloadRestaurants).toHaveBeenCalledWith();
    });
  });
});
