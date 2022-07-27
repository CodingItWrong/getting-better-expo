import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RestaurantList from './src/RestaurantList';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <RestaurantList />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
