import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, List, Text, TextInput} from 'react-native-paper';
import api from './api';

const RESTAURANTS_QUERY = 'RESTAURANTS_QUERY';

export default function RestaurantList() {
  const queryClient = useQueryClient();
  const restaurantsResult = useQuery([RESTAURANTS_QUERY], () =>
    api.get('/restaurants').then(response => response.data),
  );
  const loading = restaurantsResult.isLoading;
  const error = restaurantsResult.isError;
  const restaurants = restaurantsResult.data ?? [];

  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  function handleAdd() {
    queryClient.invalidateQueries(RESTAURANTS_QUERY);
  }

  async function handleDelete(restaurant) {
    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      queryClient.invalidateQueries(RESTAURANTS_QUERY);
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
      <NewRestaurantForm onAdd={handleAdd} />
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
