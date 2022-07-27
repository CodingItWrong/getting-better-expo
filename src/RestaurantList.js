import {useState} from 'react';
import {FlatList, Pressable, Text, TextInput} from 'react-native';
import api from './api';

export default function RestaurantList({restaurants, loading, loadError}) {
  const [name, setName] = useState('');

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
        onPress={() => api.post('/restaurants', {name}).then(() => setName(''))}
      >
        <Text>Add</Text>
      </Pressable>
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </>
  );
}
