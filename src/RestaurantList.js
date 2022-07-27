import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, TextInput} from 'react-native';
import api from './api';

export default function RestaurantList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    api
      .get('/restaurants')
      .then(response => {
        setLoading(false);
        setData(response.data);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  if (loading) {
    return <Text>Loading…</Text>;
  }

  if (error) {
    return <Text>An error occurred loading restaurants</Text>;
  }

  return (
    <>
      <TextInput
        placeholder="New restaurant name"
        value={name}
        onChangeText={setName}
      />
      <Pressable onPress={() => setName('')}>
        <Text>Add</Text>
      </Pressable>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </>
  );
}
