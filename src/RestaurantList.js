import {useState} from 'react';
import {FlatList, Pressable, Text, TextInput, View} from 'react-native';
import api from './api';

export default function RestaurantList({
  restaurants,
  reloadRestaurants,
  loading,
  loadError,
}) {
  const [name, setName] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  if (loading) {
    return <Text>Loading…</Text>;
  }

  if (loadError) {
    return <Text>An error occurred loading restaurants</Text>;
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
          <View>
            <Text>{item.name}</Text>
            <Pressable
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
    </>
  );
}
