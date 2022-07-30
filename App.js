import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RestaurantListContainer from './src/RestaurantListContainer';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <RestaurantListContainer />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
