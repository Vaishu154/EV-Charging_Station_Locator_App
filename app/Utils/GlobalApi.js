import axios from "axios";
import { Linking } from 'react-native';

const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const API_KEY = "GOOGLE_API_KEY";

const DEFAULT_STATIONS = [
  {
    id: '1',
    name: 'Central EV Charging Station',
    address: '123 Main Street',
    coordinates: {
      latitude: 18.5204,
      longitude: 73.8567
    },
    rating: 4.5,
    available: true,
    totalMachines: 4,
    availableMachines: 3,
    details: {
      operator: 'EV Power',
      connectors: [
        { type: 'CCS', power: '50kW', status: 'Available' },
        { type: 'CHAdeMO', power: '50kW', status: 'Available' }
      ]
    },
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=18.5204,73.8567'
  },
  {
    id: '2',
    name: 'City Mall EV Station',
    address: '456 Market Road',
    coordinates: {
      latitude: 18.5314,
      longitude: 73.8446
    },
    rating: 4.2,
    available: true,
    totalMachines: 6,
    availableMachines: 4,
    details: {
      operator: 'ChargePlus',
      connectors: [
        { type: 'Type 2', power: '22kW', status: 'Available' },
        { type: 'CCS', power: '50kW', status: 'Available' }
      ]
    },
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=18.5314,73.8446'
  }
];

export default {
  getNearbyStations: async (location) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          location: `${location.latitude},${location.longitude}`,
          type: 'gas_station',
          radius: 10000, // 10km radius
        }
      });

      if (response.data && response.data.results) {
        console.log('Google Places results:', response.data.results.length);
        const stations = response.data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          coordinates: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          },
          rating: place.rating || 0,
          available: true,
          totalMachines: 2,
          availableMachines: 2,
          details: {
            operator: place.business_status || 'Unknown',
            connectors: [
              { type: 'Type 2', power: '22kW', status: 'Available' }
            ]
          },
          directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`
        }));
        return { data: { results: stations } };
      }
      return { data: { results: DEFAULT_STATIONS } };
    } catch (error) {
      console.error('Error fetching stations:', error);
      return { data: { results: DEFAULT_STATIONS } };
    }
  },

  searchLocation: async (query) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: query,
          key: API_KEY
        }
      });

      if (response.data && response.data.results) {
        return {
          data: response.data.results.map(place => ({
            place_id: place.place_id,
            display_name: place.name,
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng
          }))
        };
      }
      return { data: [] };
    } catch (error) {
      console.error('Error searching location:', error);
      return { data: [] };
    }
  }
}; 