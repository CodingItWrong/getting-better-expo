import {useEffect, useState} from 'react';
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
    (async () => {
      try {
        await loadRestaurants();
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {restaurants, loading, error, loadRestaurants};
}

export default function RestaurantList() {
  const {restaurants, loading, error, loadRestaurants} = useRestaurants();

  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function handleRefresh() {
    setRefreshing(true);
    await loadRestaurants();
    setRefreshing(false);
  }

  async function handleDelete(restaurant) {
    try {
      await api.delete(`/restaurants/${restaurant.id}`);
      await loadRestaurants();
    } catch {
      setUpdateErrorMessage('An error occurred deleting the restaurant');
    }
  }

  if (loading) {
    return <Text style={styles.message}>Loading…</Text>;
  }

  if (error) {
    return (
      <Text style={[styles.message, styles.error]}>
        An error occurred loading restaurants
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <NewRestaurantForm onAdd={loadRestaurants} />
      {updateErrorMessage && (
        <Text style={[styles.message, styles.error]}>{updateErrorMessage}</Text>
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
      {error && <Text style={[styles.message, styles.error]}>{error}</Text>}
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
  message: {
    fontSize: 18,
    padding: 10,
  },
  error: {
    color: 'red',
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
