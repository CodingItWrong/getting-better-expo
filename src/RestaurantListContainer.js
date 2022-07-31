import {useQuery, useQueryClient} from '@tanstack/react-query';
import RestaurantList from './RestaurantList';
import api from './api';

const RESTAURANTS_QUERY = 'RESTAURANTS_QUERY';

function useRestaurants() {
  async function loadRestaurants() {
    const response = await api.get('/restaurants');
    return response.data;
  }

  function reloadRestaurants() {
    queryClient.invalidateQueries(RESTAURANTS_QUERY);
  }

  const queryClient = useQueryClient();
  const restaurantsResult = useQuery([RESTAURANTS_QUERY], loadRestaurants);

  const restaurants = restaurantsResult.data ?? [];
  const loading = restaurantsResult.isLoading;
  const loadError = restaurantsResult.isError;

  return {restaurants, loading, loadError, reloadRestaurants};
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
