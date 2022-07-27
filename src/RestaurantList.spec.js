import {act, fireEvent, render, screen} from '@testing-library/react-native';
import flushPromises from 'flush-promises';
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
      render(<RestaurantList loading />);

      expect(screen.queryByText('Loading…')).not.toBeNull();
    });
  });

  describe('when loading succeeds', () => {
    function renderRestaurants() {
      render(<RestaurantList restaurants={restaurants} />);
    }

    it('renders restaurants from the server', () => {
      renderRestaurants();

      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();
    });

    it('hides the loading indicator', () => {
      renderRestaurants();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    function renderRestaurants() {
      render(<RestaurantList loadError />);
    }

    it('renders an error message', () => {
      renderRestaurants();

      expect(
        screen.queryByText('An error occurred loading restaurants'),
      ).not.toBeNull();
    });

    it('hides the loading indicator', () => {
      renderRestaurants();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when adding a restaurant succeeds', () => {
    const name = 'Burger Place';

    let reloadRestaurants;

    async function addRestaurant() {
      api.post.mockResolvedValue();

      reloadRestaurants = jest
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

      await act(flushPromises);
    }

    it('clears the new restaurant name field', async () => {
      await addRestaurant();

      expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
        'value',
        '',
      );
    });

    it('makes the right request to the server', async () => {
      await addRestaurant();

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});
    });

    it('re-requests the data from the server', async () => {
      await addRestaurant();

      expect(reloadRestaurants).toHaveBeenCalledWith();
    });
  });

  describe('when adding a restaurant fails', () => {
    async function addRestaurant() {
      api.post.mockRejectedValue();

      render(<RestaurantList restaurants={[]} />);

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        'Burger Place',
      );
      fireEvent.press(screen.getByText('Add'));

      await act(flushPromises);
    }

    it('shows an error message', async () => {
      await addRestaurant();

      expect(
        screen.queryByText('An error occurred adding the restaurant'),
      ).not.toBeNull();
    });
  });

  describe('when deleting a restaurant succeeds', () => {
    let reloadRestaurants;

    async function deleteRestaurant() {
      api.delete.mockResolvedValue();

      reloadRestaurants = jest
        .fn()
        .mockName('reloadRestaurants')
        .mockResolvedValue();

      render(
        <RestaurantList
          restaurants={restaurants}
          reloadRestaurants={reloadRestaurants}
        />,
      );

      fireEvent.press(screen.getAllByText('Delete')[0]);

      await act(flushPromises);
    }

    it('sends the right data to the server', async () => {
      await deleteRestaurant();
      expect(api.delete).toHaveBeenCalledWith(
        `/restaurants/${restaurants[0].id}`,
      );
    });

    it('re-requests the data from the server', async () => {
      await deleteRestaurant();

      expect(reloadRestaurants).toHaveBeenCalledWith();
    });
  });

  describe('when deleting a restaurant fails', () => {
    async function deleteRestaurant() {
      api.delete.mockRejectedValue();

      render(<RestaurantList restaurants={restaurants} />);

      await screen.findByText(restaurants[0].name);

      fireEvent.press(screen.getAllByText('Delete')[0]);

      await act(flushPromises);
    }

    it('shows an error message', async () => {
      await deleteRestaurant();

      expect(
        screen.queryByText('An error occurred deleting the restaurant'),
      ).not.toBeNull();
    });
  });
});
