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

  function loadRestaurants() {
    return api.get('/restaurants').then(response => setData(response.data));
  }

  useEffect(() => {
    loadRestaurants()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleAdd() {
    api
      .post('/restaurants', {name})
      .then(loadRestaurants)
      .then(response => {
        setName('');
      })
      .catch(() =>
        setUpdateErrorMessage('An error occurred adding the restaurant'),
      );
  }

  function handleDelete(item) {
    api
      .delete(`/restaurants/${item.id}`)
      .then(loadRestaurants)
      .catch(() =>
        setUpdateErrorMessage('An error occurred deleting the restaurant'),
      );
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
      {updateErrorMessage && (
        <Text style={[styles.message, styles.error]}>{updateErrorMessage}</Text>
      )}
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
  message: {
    fontSize: 18,
    padding: 10,
  },
  error: {
    color: 'red',
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
