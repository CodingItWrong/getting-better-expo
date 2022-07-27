import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import RestaurantList from './src/RestaurantList';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <RestaurantList />
      </SafeAreaView>
    </>
  );
}
