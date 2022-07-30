import {useEffect, useState} from 'react';
import RestaurantList from './RestaurantList';
import api from './api';

function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  async function loadRestaurants() {
    const response = await api.get('/restaurants');
    setRestaurants(response.data);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadRestaurants();
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {restaurants, loading, loadError, reloadRestaurants: loadRestaurants};
}

export default function RestaurantListContainer() {
  const {restaurants, loading, loadError, reloadRestaurants} = useRestaurants();

  return (
    <RestaurantList
      restaurants={restaurants}
      loading={loading}
      loadError={loadError}
      reloadRestaurants={reloadRestaurants}
    />
  );
}
