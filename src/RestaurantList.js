import {useEffect, useState} from 'react';
import {FlatList, Text} from 'react-native';
import api from './api';

export default function RestaurantList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/restaurants').then(response => setData(response.data));
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <Text>{item.name}</Text>}
    />
  );
}
