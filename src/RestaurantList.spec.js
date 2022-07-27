import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import flushPromises from 'flush-promises';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import RestaurantList from './RestaurantList';
import api from './api';

jest.mock('./api');

describe('RestaurantList', () => {
  const restaurants = [
    {id: 1, name: 'Pizza Place'},
    {id: 2, name: 'Salad Place'},
  ];

  function providers(children) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: Infinity,
        },
      },
      logger: {
        log: () => {},
        warn: () => {},
        error: () => {},
      },
    });

    return (
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </PaperProvider>
    );
  }

  describe('while loading', () => {
    it('shows a loading indicator', async () => {
      const neverSettles = new Promise(() => {});
      api.get.mockReturnValue(neverSettles);

      render(providers(<RestaurantList />));

      expect(screen.queryByText('Loading…')).not.toBeNull();
    });
  });

  describe('when loading succeeds', () => {
    it('renders restaurants from the server', async () => {
      api.get.mockResolvedValue({data: restaurants});

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);
      expect(screen.queryByText(restaurants[1].name)).not.toBeNull();

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when loading fails', () => {
    async function renderRestaurants() {
      api.get.mockRejectedValue();

      render(providers(<RestaurantList />));
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
    const newRestaurant = {id: 3, name};

    it('displays the new restaurant reloaded from the server', async () => {
      api.get
        .mockResolvedValueOnce({data: restaurants})
        .mockResolvedValue({data: [...restaurants, newRestaurant]});
      api.post.mockResolvedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        name,
      );
      fireEvent.press(screen.getByText('Add'));

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});

      await screen.findByText(name);

      expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
        'value',
        '',
      );
    });
  });

  describe('when adding a restaurant fails', () => {
    async function addRestaurant() {
      api.get.mockResolvedValue({data: restaurants});
      api.post.mockRejectedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

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
    it('removes the new restaurant after reloading from the server', async () => {
      api.get
        .mockResolvedValueOnce({data: restaurants})
        .mockResolvedValue({data: restaurants.filter(r => r.id !== 1)});
      api.delete.mockResolvedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.press(screen.getAllByText('Delete')[0]);

      expect(api.delete).toHaveBeenCalledWith(
        `/restaurants/${restaurants[0].id}`,
      );

      await waitForElementToBeRemoved(() =>
        screen.getByText(restaurants[0].name),
      );
    });
  });

  describe('when deleting a restaurant fails', () => {
    async function deleteRestaurant() {
      api.get.mockResolvedValue({data: restaurants});
      api.delete.mockRejectedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.press(screen.getAllByText('Delete')[0]);
    }

    it('shows an error message', async () => {
      await deleteRestaurant();

      await act(flushPromises);

      expect(
        screen.queryByText('An error occurred deleting the restaurant'),
      ).not.toBeNull();
    });
  });
});
