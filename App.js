import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import RestaurantList from './src/RestaurantList';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <RestaurantList />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
