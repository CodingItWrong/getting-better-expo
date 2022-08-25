import {FlatList, Text} from 'react-native';

export default function RestaurantList({restaurants, loadError}) {
  if (loadError) {
    return <Text>An error occurred while loading the restaurants</Text>;
  }

  return (
    <>
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.name}</Text>}
      />
    </>
  );
}
