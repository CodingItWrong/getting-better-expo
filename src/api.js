import axios from 'axios';
import Constants from 'expo-constants';

const {apiKey} = Constants.manifest.extra;

const api = axios.create({
  baseURL: `https://api.outsidein.dev/${apiKey}`,
});

export default api;
