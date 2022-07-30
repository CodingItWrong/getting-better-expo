import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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
    return <PaperProvider>{children}</PaperProvider>;
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
    it('renders an error message', async () => {
      api.get.mockRejectedValue();

      render(providers(<RestaurantList />));

      await screen.findByText('An error occurred loading restaurants');

      expect(screen.queryByText('Loading…')).toBeNull();
    });
  });

  describe('when adding a restaurant succeeds', () => {
    const name = 'Burger Place';
    const newRestaurant = {id: 3, name};

    it('clears the new restaurant name field', async () => {
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

      await waitFor(() =>
        expect(screen.getByPlaceholderText('New restaurant name')).toHaveProp(
          'value',
          '',
        ),
      );

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});

      expect(screen.queryByText(name)).not.toBeNull();
    });
  });

  describe('when adding a restaurant fails', () => {
    it('shows an error message', async () => {
      api.get.mockResolvedValue({data: restaurants});
      api.post.mockRejectedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.changeText(
        screen.getByPlaceholderText('New restaurant name'),
        'Burger Place',
      );
      fireEvent.press(screen.getByText('Add'));

      await waitFor(() =>
        expect(
          screen.queryByText('An error occurred adding the restaurant'),
        ).not.toBeNull(),
      );
    });
  });

  describe('when deleting a restaurant succeeds', () => {
    it('re-requests the data from the server', async () => {
      api.get
        .mockResolvedValueOnce({data: restaurants})
        .mockResolvedValue({data: restaurants.filter(r => r.id !== 1)});
      api.delete.mockResolvedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.press(screen.getAllByText('Delete')[0]);

      await waitFor(() =>
        expect(screen.queryByText(restaurants[0].name)).toBeNull(),
      );

      expect(api.delete).toHaveBeenCalledWith(
        `/restaurants/${restaurants[0].id}`,
      );
    });
  });

  describe('when deleting a restaurant fails', () => {
    it('shows an error message', async () => {
      api.get.mockResolvedValue({data: restaurants});
      api.delete.mockRejectedValue();

      render(providers(<RestaurantList />));

      await screen.findByText(restaurants[0].name);

      fireEvent.press(screen.getAllByText('Delete')[0]);

      await screen.findByText('An error occurred deleting the restaurant');
    });
  });
});
