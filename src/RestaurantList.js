import {FlatList, StyleSheet, Text, View} from 'react-native';

export default function RestaurantList({restaurants, loading, loadError}) {
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
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.restaurantRow}>
            <Text style={styles.restaurantName}>{item.name}</Text>
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
