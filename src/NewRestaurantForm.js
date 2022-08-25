import {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import sharedStyles from './sharedStyles';

export default function NewRestaurantForm({onAdd}) {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    await onAdd(name);
    setAdding(false);
    setName('');
  }

  return (
    <View style={styles.addRow}>
      <TextInput
        placeholder="New restaurant name"
        value={name}
        onChangeText={setName}
        style={styles.newRestaurantNameField}
      />
      <Pressable
        testID="add-button"
        disabled={adding}
        style={[sharedStyles.button, styles.addButton]}
        onPress={handleAdd}
      >
        <Text style={adding && sharedStyles.buttonTextDisabled}>
          {adding ? 'Adding…' : 'Add'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    padding: 8,
  },
  newRestaurantNameField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  addButton: {
    marginLeft: 8,
  },
});
