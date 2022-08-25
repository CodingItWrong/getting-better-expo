import {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import NewRestaurantForm from './NewRestaurantForm';
import api from './api';
import sharedStyles from './sharedStyles';

export default function RestaurantList({
  restaurants,
  loading,
  loadError,
  reloadRestaurants,
}) {
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function handleAdd(name) {
    try {
      await api.post('/restaurants', {name});
      await reloadRestaurants();
    } catch {
      setUpdateErrorMessage('An error occurred adding the restaurant');
    }
  }

  async function handleDelete(restaurant) {
    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      await reloadRestaurants();
    } catch (e) {
      setUpdateErrorMessage('An error occurred deleting the restaurant');
      throw e;
    }
  }

  if (loading) {
    return <Text style={styles.message}>Loading…</Text>;
  }

  if (loadError) {
    return (
      <Text style={[styles.message, styles.error]}>
        An error occurred while loading the restaurants
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <NewRestaurantForm onAdd={handleAdd} />
      {updateErrorMessage && (
        <Text style={[styles.message, styles.error]}>{updateErrorMessage}</Text>
      )}
      <FlatList
        data={restaurants}
        keyExtractor={restaurant => restaurant.id}
        renderItem={({item: restaurant}) => (
          <RestaurantRow
            restaurant={restaurant}
            onDelete={() => handleDelete(restaurant)}
          />
        )}
      />
    </View>
  );
}

function RestaurantRow({restaurant, onDelete}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await onDelete();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.restaurantRow}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Pressable
        testID="delete-button"
        disabled={deleting}
        style={sharedStyles.button}
        onPress={handleDelete}
      >
        <Text style={deleting && sharedStyles.buttonTextDisabled}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    padding: 8,
  },
  error: {
    color: 'red',
    fontSize: 18,
    padding: 8,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
  },
});
