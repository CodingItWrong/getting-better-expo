import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, TextInput} from 'react-native';
import api from './api';

export default function RestaurantList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  useEffect(() => {
    api
      .get('/restaurants')
      .then(response => {
        setLoading(false);
        setData(response.data);
      })
      .then(response => {
        setLoading(false);
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
      <Pressable
        onPress={() =>
          api
            .post('/restaurants', {name})
            .then(() => api.get('/restaurants'))
            .then(response => {
              setData(response.data);
              setName('');
            })
            .catch(() =>
              setUpdateErrorMessage('An error occurred adding the restaurant'),
            )
        }
      >
        <Text>Add</Text>
      </Pressable>
      {updateErrorMessage && <Text>{updateErrorMessage}</Text>}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </>
  );
}
