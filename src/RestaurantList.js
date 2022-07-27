import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from './api';

function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadRestaurants() {
    const response = await api.get('/restaurants');
    setRestaurants(response.data);
  }

  useEffect(() => {
    loadRestaurants()
      .then(response => {
        setLoading(false);
      })
      .then(response => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  return {restaurants, loading, error, loadRestaurants};
}

export default function RestaurantList() {
  const {restaurants, loading, error, loadRestaurants} = useRestaurants();
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function handleDelete(restaurant) {
    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      await loadRestaurants();
    } catch {
      setUpdateErrorMessage('An error occurred deleting the restaurant');
    }
  }

  if (loading) {
    return <Text>Loading…</Text>;
  }

  if (error) {
    return <Text>An error occurred loading restaurants</Text>;
  }

  return (
    <View style={styles.container}>
      <NewRestaurantForm onAdd={loadRestaurants} />
      {updateErrorMessage && <Text>{updateErrorMessage}</Text>}
      <FlatList
        data={restaurants}
        keyExtractor={restaurant => restaurant.id}
        renderItem={({item: restaurant}) => (
          <RestaurantRow
            restaurant={restaurant}
            handleDelete={() => handleDelete(restaurant)}
          />
        )}
      />
    </View>
  );
}

function NewRestaurantForm({onAdd}) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  async function handleAdd() {
    try {
      await api.post('/restaurants', {name});
      await onAdd();
      setName('');
    } catch {
      setError('An error occurred adding the restaurant');
    }
  }

  return (
    <>
      <View style={styles.addRow}>
        <TextInput
          placeholder="New restaurant name"
          value={name}
          onChangeText={setName}
          style={styles.newRestaurantNameField}
        />
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={handleAdd}
        >
          <Text>Add</Text>
        </Pressable>
      </View>
      {error && <Text>{error}</Text>}
    </>
  );
}

function RestaurantRow({restaurant, handleDelete}) {
  return (
    <View style={styles.restaurantRow}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Pressable style={styles.button} onPress={handleDelete}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addRow: {
    flexDirection: 'row',
    alignContent: 'end',
    padding: 8,
  },
  newRestaurantNameField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
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
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eee',
  },
  addButton: {
    marginLeft: 8,
  },
});
