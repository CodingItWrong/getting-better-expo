import {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import RestaurantRow from './RestaurantRow';
import api from './api';

export default function RestaurantList({
  restaurants,
  reloadRestaurants,
  loading,
  loadError,
}) {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function handleAdd() {
    try {
      setAdding(true);
      await api.post('/restaurants', {name});
      await reloadRestaurants();
      setName('');
      setAdding(false);
    } catch {
      setUpdateErrorMessage('An error occurred adding the restaurant');
    }
  }

  async function handleDelete(item) {
    try {
      await api.delete(`/restaurants/${item.id}`);
      await reloadRestaurants();
    } catch {
      setUpdateErrorMessage('An error occurred deleting the restaurant');
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
      <View style={styles.addRow}>
        <TextInput
          mode="outlined"
          placeholder="New restaurant name"
          value={name}
          onChangeText={setName}
          style={styles.newRestaurantNameField}
        />
        <Button
          testID="add-button"
          disabled={adding}
          mode="contained"
          style={styles.addButton}
          onPress={handleAdd}
        >
          {adding ? 'Adding…' : 'Add'}
        </Button>
      </View>
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
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  newRestaurantNameField: {
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
  addButton: {
    marginLeft: 8,
  },
});
