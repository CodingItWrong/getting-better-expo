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
  const loadErrorMessage = 'An error occurred while loading the restaurants';
  const loadingMessage = 'Loading…';

  describe('while loading', () => {
    it('displays a loading indicator', () => {
      render(<RestaurantList loading />);

      expect(screen.queryByText(loadingMessage)).toBeTruthy();
    });
  });

  describe('when restaurants are available', () => {
    it('displays the restaurant names', () => {
      render(<RestaurantList restaurants={restaurants} />);

      expect(screen.queryByText(restaurants[0].name)).toBeTruthy();
      expect(screen.queryByText(restaurants[1].name)).toBeTruthy();

      expect(screen.queryByText(loadingMessage)).toBeNull();
      expect(screen.queryByText(loadErrorMessage)).toBeNull();
    });
  });

  describe('when there is a load error', () => {
    it('displays an error message', () => {
      render(<RestaurantList loadError />);

      expect(screen.queryByText(loadErrorMessage)).toBeTruthy();

      expect(screen.queryByText(loadingMessage)).toBeNull();
    });
  });

  describe('when adding a restaurant succeeds', () => {
    const name = 'Burger Place';

    it('saves the restaurant to the server', async () => {
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

      await waitFor(() => expect(reloadRestaurants).toHaveBeenCalledWith());

      expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
        'value',
        '',
      );
    });
  });

  describe('when adding a restaurant fails', () => {
    it('shows an error message', async () => {
      api.post.mockRejectedValue();

      render(<RestaurantList restaurants={[]} />);

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        'Burger Place',
      );
      fireEvent.press(screen.getByText('Add'));

      await screen.findByText('An error occurred adding the restaurant');
    });
  });
});
