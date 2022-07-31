import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import api from './api';

export default function NewRestaurantForm({onSuccess, onError}) {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    try {
      setAdding(true);
      await api.post('/restaurants', {name});
      await onSuccess();
      setName('');
      setAdding(false);
    } catch {
      onError();
    }
  }

  return (
    <View style={styles.addRow}>
      <TextInput
        mode="outlined"
        placeholder="New restaurant name"
        value={name}
        onChangeText={setName}
        style={styles.newRestaurantNameField}
      />
      <Button
        testID="add-button"
        disabled={adding}
        mode="contained"
        style={styles.addButton}
        onPress={handleAdd}
      >
        {adding ? 'Adding…' : 'Add'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  newRestaurantNameField: {
    flex: 1,
  },
  addButton: {
    marginLeft: 8,
  },
});
