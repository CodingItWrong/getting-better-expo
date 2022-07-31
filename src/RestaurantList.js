import {useState} from 'react';
import {FlatList, Pressable, Text, TextInput} from 'react-native';
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
        testID="add-button"
        disabled={adding}
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
              setUpdateErrorMessage('An error occurred adding the restaurant'),
            );
        }}
      >
        <Text>{adding ? 'Adding…' : 'Add'}</Text>
      </Pressable>
      {updateErrorMessage && <Text>{updateErrorMessage}</Text>}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </>
  );
}
