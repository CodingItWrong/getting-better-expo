import {render, screen} from '@testing-library/react-native';
import RestaurantList from './RestaurantList';

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
});
