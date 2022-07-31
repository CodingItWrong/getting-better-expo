import {useState} from 'react';
import {Button, List} from 'react-native-paper';

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
    <List.Item
      title={restaurant.name}
      right={() => deleteButton({deleting, handleDelete})}
    />
  );
}

function deleteButton({deleting, handleDelete}) {
  return (
    <Button mode="outlined" disabled={deleting} onPress={handleDelete}>
      {deleting ? 'Deleting…' : 'Delete'}
    </Button>
  );
}
