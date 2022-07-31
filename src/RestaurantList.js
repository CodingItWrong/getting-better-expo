import {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import NewRestaurantForm from './NewRestaurantForm';
import RestaurantRow from './RestaurantRow';
import api from './api';

export default function RestaurantList({
  restaurants,
  reloadRestaurants,
  loading,
  loadError,
}) {
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function handleDelete(item) {
    try {
      await api.delete(`/restaurants/${item.id}`);
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
      <Text style={styles.error}>An error occurred loading restaurants</Text>
    );
  }

  return (
    <View style={styles.container}>
      <NewRestaurantForm
        onSuccess={reloadRestaurants}
        onError={() =>
          setUpdateErrorMessage('An error occurred adding the restaurant')
        }
      />
      {updateErrorMessage && (
        <Text style={styles.error}>{updateErrorMessage}</Text>
      )}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <RestaurantRow
            restaurant={item}
            onDelete={() => handleDelete(item)}
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
