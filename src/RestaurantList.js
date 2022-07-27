import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from './api';

export default function RestaurantList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  async function loadRestaurants() {
    const response = await api.get('/restaurants');
    setData(response.data);
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

  async function handleAdd() {
    try {
      await api.post('/restaurants', {name});
      await loadRestaurants();
      setName('');
    } catch {
      setUpdateErrorMessage('An error occurred adding the restaurant');
    }
  }

  async function handleDelete(item) {
    try {
      await api.delete(`/restaurants/${item.id}`);
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
      {updateErrorMessage && <Text>{updateErrorMessage}</Text>}
      <FlatList
        data={data}
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
