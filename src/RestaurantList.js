import {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import NewRestaurantForm from './NewRestaurantForm';
import RestaurantRow from './RestaurantRow';
import api from './api';

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
});
