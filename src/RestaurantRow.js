import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import sharedStyles from './sharedStyles';

export default function RestaurantRow({restaurant, onDelete}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await onDelete();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.restaurantRow}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Pressable
        style={sharedStyles.button}
        disabled={deleting}
        onPress={handleDelete}
      >
        <Text style={deleting && sharedStyles.buttonTextDisabled}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
  },
  addButton: {
    marginLeft: 8,
  },
});
