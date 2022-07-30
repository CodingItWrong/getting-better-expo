import {FlatList, Text} from 'react-native';

export default function RestaurantList({restaurants}) {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={item => item.id}
      renderItem={({item}) => <Text>{item.name}</Text>}
    />
  );
}
