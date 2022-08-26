import {fireEvent, render, screen} from '@testing-library/react-native';
import RestaurantRow from './RestaurantRow';

describe('RestaurantRow', () => {
  const restaurant = {name: 'Pizza Place'};

  it('displays the restaurant name', () => {
    render(<RestaurantRow restaurant={restaurant} />);

    expect(screen.queryByText(restaurant.name)).toBeTruthy();
  });

  it('allows deleting the restaurant', () => {
    const onDelete = jest.fn().mockName('onDelete');

    render(<RestaurantRow restaurant={restaurant} onDelete={onDelete} />);

    fireEvent.press(screen.getByText('Delete'));

    expect(screen.queryByText('Deleting…')).toBeTruthy();

    expect(onDelete).toHaveBeenCalledWith();
  });
});
