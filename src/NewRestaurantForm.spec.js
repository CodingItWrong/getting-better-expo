import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import NewRestaurantForm from './NewRestaurantForm';
import api from './api';

jest.mock('./api');

describe('NewRestaurantForm', () => {
  const nameInputPlaceholder = 'New restaurant name';
  const name = 'Burger Place';

  describe('when adding a restaurant succeeds', () => {
    const addingLabel = 'Adding…';

    it('clears the new restaurant name field', async () => {
      const onSuccess = jest.fn().mockName('onSuccess').mockResolvedValue();

      api.post.mockResolvedValue();

      render(<NewRestaurantForm onSuccess={onSuccess} />);

      fireEvent.changeText(
        screen.getByPlaceholderText(nameInputPlaceholder),
        name,
      );
      fireEvent.press(screen.getByText('Add'));

      expect(screen.queryByText(addingLabel)).not.toBeNull();
      expect(
        screen.getByTestId('add-button').props.accessibilityState.disabled,
      ).toEqual(true);

      expect(api.post).toHaveBeenCalledWith('/restaurants', {name});

      await waitFor(() =>
        expect(screen.getByPlaceholderText(nameInputPlaceholder)).toHaveProp(
          'value',
          '',
        ),
      );

      expect(screen.queryByText(addingLabel)).toBeNull();
      expect(
        screen.getByTestId('add-button').props.accessibilityState.disabled,
      ).toEqual(false);

      expect(onSuccess).toHaveBeenCalledWith();
    });
  });

  describe('when adding a restaurant fails', () => {
    it('calls the onError prop', async () => {
      api.post.mockRejectedValue();

      const onError = jest.fn().mockName('onError');

      render(<NewRestaurantForm onError={onError} />);

      fireEvent.changeText(
        screen.getByPlaceholderText(nameInputPlaceholder),
        name,
      );
      fireEvent.press(screen.getByText('Add'));

      await waitFor(() => expect(onError).toHaveBeenCalledWith());

      expect(screen.getByPlaceholderText(nameInputPlaceholder)).toHaveProp(
        'value',
        name,
      );
    });
  });
});
