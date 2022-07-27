import {useEffect, useState} from 'react';
import {FlatList, Text} from 'react-native';
import api from './api';

export default function RestaurantList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/restaurants')
      .then(response => setData(response.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <Text>An error occurred loading restaurants</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <Text>{item.name}</Text>}
    />
  );
}
