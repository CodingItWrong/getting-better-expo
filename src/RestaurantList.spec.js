import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import flushPromises from 'flush-promises';
import React from 'react';
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
    async function renderRestaurants() {
      api.get.mockResolvedValue({data: restaurants});

      render(<RestaurantList />);

      await act(flushPromises);
    }

    it('renders restaurants from the server', async () => {
      await renderRestaurants();
      expect(screen.queryByText(restaurants[0].name)).not.toBeNull();
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();
    });

    it('hides the loading indicator', async () => {
      await renderRestaurants();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    async function renderRestaurants() {
      api.get.mockRejectedValue();

      render(<RestaurantList />);
    }

    it('renders an error message', async () => {
      renderRestaurants();

      await screen.findByText('An error occurred loading restaurants');
    });

    it('hides the loading indicator', async () => {
      renderRestaurants();

      await waitForElementToBeRemoved(() => screen.getByText('Loading…'));
    });
  });

  describe('when adding a restaurant succeeds', () => {
    const name = 'Burger Place';

    async function addRestaurant() {
      api.get.mockResolvedValue({data: restaurants});

      render(<RestaurantList />);

      await screen.findByText(restaurants[0].name);

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