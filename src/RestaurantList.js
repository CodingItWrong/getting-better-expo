import {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from './api';

export default function RestaurantList({
  restaurants,
  loading,
  loadError,
  reloadRestaurants,
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
      <Text style={[styles.message, styles.error]}>
        An error occurred while loading the restaurants
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <TextInput
          placeholder="New restaurant name"
          value={name}
          onChangeText={setName}
          style={styles.newRestaurantNameField}
        />
        <Pressable
          testID="add-button"
          disabled={adding}
          style={[styles.button, styles.addButton]}
          onPress={handleAdd}
        >
          <Text style={adding && styles.buttonTextDisabled}>
            {adding ? 'Adding…' : 'Add'}
          </Text>
        </Pressable>
      </View>
      {updateErrorMessage && (
        <Text style={[styles.message, styles.error]}>{updateErrorMessage}</Text>
      )}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.restaurantRow}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Pressable style={styles.button} onPress={() => handleDelete(item)}>
              <Text>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonTextDisabled: {
    color: '#999',
  },
  container: {
    flex: 1,
  },
  addRow: {
    flexDirection: 'row',
    padding: 8,
  },
  newRestaurantNameField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  addButton: {
    marginLeft: 8,
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
