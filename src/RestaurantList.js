import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, List, Text, TextInput} from 'react-native-paper';
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
          mode="outlined"
          placeholder="New restaurant name"
          value={name}
          onChangeText={setName}
          style={styles.newRestaurantNameField}
        />
        <Button mode="contained" style={styles.addButton} onPress={handleAdd}>
          Add
        </Button>
      </View>
      {error && <Text>{error}</Text>}
    </>
  );
}

function RestaurantRow({restaurant, handleDelete}) {
  return (
    <List.Item
      title={restaurant.name}
      right={() => rightButton(handleDelete)}
    />
  );
}

function rightButton(handlePress) {
  return (
    <Button mode="outline" onPress={handlePress}>
      Delete
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  newRestaurantNameField: {
    flex: 1,
  },
  addButton: {
    marginLeft: 8,
  },
});
