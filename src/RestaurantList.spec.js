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

  function providers(children) {
    return children;
  }

  describe('while loading', () => {
    it('shows a loading indicator', () => {
      render(providers(<RestaurantList loading />));

      expect(screen.queryByText('Loading…')).not.toBeNull();
    });
  });

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', () => {
      render(providers(<RestaurantList restaurants={restaurants} />));

      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    it('renders an error message', () => {
      render(providers(<RestaurantList loadError />));

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
        providers(
          <RestaurantList
            restaurants={[]}
            reloadRestaurants={reloadRestaurants}
          />,
        ),
      );

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        name,
      );
      fireEvent.press(screen.getByText('Add'));

      expect(screen.queryByText('Adding…')).not.toBeNull();
      expect(
        screen.getByTestId('add-button').props.accessibilityState.disabled,
      ).toEqual(true);

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});

      await waitFor(() =>
        expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
          'value',
          '',
        ),
      );

      expect(screen.queryByText('Adding…')).toBeNull();
      expect(
        screen.getByTestId('add-button').props.accessibilityState.disabled,
      ).toEqual(false);

      expect(reloadRestaurants).toHaveBeenCalledWith();
    });
  });

  describe('when adding a restaurant fails', () => {
    it('shows an error message', async () => {
      api.post.mockRejectedValue();

      render(providers(<RestaurantList restaurants={[]} />));

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        'Burger Place',
      );
      fireEvent.press(screen.getByText('Add'));

      await screen.findByText('An error occurred adding the restaurant');
    });
  });

  describe('when deleting a restaurant succeeds', () => {
    it('re-requests data from the server', async () => {
      api.delete.mockResolvedValue();

      const reloadRestaurants = jest
        .fn()
        .mockName('reloadRestaurants')
        .mockResolvedValue();

      render(
        providers(
          <RestaurantList
            restaurants={restaurants}
            reloadRestaurants={reloadRestaurants}
          />,
        ),
      );

      fireEvent.press(screen.getAllByText('Delete')[0]);

      expect(api.delete).toHaveBeenCalledWith(
        `/restaurants/${restaurants[0].id}`,
      );

      await waitFor(() => expect(reloadRestaurants).toHaveBeenCalledWith());
    });
  });

  describe('when deleting a restaurant fails', () => {
    it('shows an error message', async () => {
      api.delete.mockRejectedValue();

      render(providers(<RestaurantList restaurants={restaurants} />));

      fireEvent.press(screen.getAllByText('Delete')[0]);

      await screen.findByText('An error occurred deleting the restaurant');
    });
  });
});
