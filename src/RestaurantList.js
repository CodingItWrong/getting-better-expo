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
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

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
    <>
      <TextInput
        placeholder="New restaurant name"
        value={name}
        onChangeText={setName}
      />
      <Pressable
        onPress={() =>
          api
            .post('/restaurants', {name})
            .then(() => reloadRestaurants())
            .then(() => setName(''))
            .catch(() =>
              setUpdateErrorMessage('An error occurred adding the restaurant'),
            )
        }
      >
        <Text>Add</Text>
      </Pressable>
      {updateErrorMessage && <Text>{updateErrorMessage}</Text>}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.restaurantRow}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Pressable
              onPress={() =>
                api
                  .delete(`/restaurants/${item.id}`)
                  .then(() => reloadRestaurants())
              }
            >
              <Text>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  restaurantName: {
    fontSize: 18,
  },
});
