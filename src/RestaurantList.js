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
  reloadRestaurants,
  loading,
  loadError,
}) {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

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
          placeholder="New restaurant name"
          value={name}
          onChangeText={setName}
          style={styles.newRestaurantNameField}
        />
        <Pressable
          testID="add-button"
          disabled={adding}
          style={[styles.button, styles.addButton]}
          onPress={() => {
            setAdding(true);
            api
              .post('/restaurants', {name})
              .then(() => reloadRestaurants())
              .then(() => {
                setName('');
                setAdding(false);
              })
              .catch(() =>
                setUpdateErrorMessage(
                  'An error occurred adding the restaurant',
                ),
              );
          }}
        >
          <Text style={adding && styles.buttonTextDisabled}>
            {adding ? 'Adding…' : 'Add'}
          </Text>
        </Pressable>
      </View>
      {updateErrorMessage && (
        <Text style={styles.error}>{updateErrorMessage}</Text>
      )}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.restaurantRow}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Pressable
              style={styles.button}
              onPress={() =>
                api
                  .delete(`/restaurants/${item.id}`)
                  .then(() => reloadRestaurants())
                  .catch(() =>
                    setUpdateErrorMessage(
                      'An error occurred deleting the restaurant',
                    ),
                  )
              }
            >
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
  addButton: {
    marginLeft: 8,
  },
});
