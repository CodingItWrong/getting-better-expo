import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
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

  it('re-enables the button if deleting fails', async () => {
    const onDelete = jest.fn().mockName('onDelete').mockRejectedValue();

    render(<RestaurantRow restaurant={restaurant} onDelete={onDelete} />);

    fireEvent.press(screen.getByText('Delete'));

    expect(screen.queryByText('Deleting…')).toBeTruthy();
    expect(screen.getByTestId('delete-button')).toHaveProp(
      'accessibilityState',
      {disabled: true},
    );

    expect(onDelete).toHaveBeenCalledWith();

    await waitForElementToBeRemoved(() => screen.getByText('Deleting…'));
    expect(screen.getByTestId('delete-button')).toHaveProp(
      'accessibilityState',
      {disabled: false},
    );
  });
});
