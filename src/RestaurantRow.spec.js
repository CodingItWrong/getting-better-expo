import {render, screen} from '@testing-library/react-native';
import RestaurantRow from './RestaurantRow';

describe('RestaurantRow', () => {
  const restaurant = {name: 'Pizza Place'};

  it('displays the restaurant name', () => {
    render(<RestaurantRow restaurant={restaurant} />);

    expect(screen.queryByText(restaurant.name)).toBeTruthy();
  });
});
