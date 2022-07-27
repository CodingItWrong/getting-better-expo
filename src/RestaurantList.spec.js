import {act, fireEvent, render, screen} from '@testing-library/react-native';
import flushPromises from 'flush-promises';
import RestaurantList from './RestaurantList';

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

    async function addRestaurant() {
      render(<RestaurantList restaurants={[]} />);

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
  });
});
