import axios from "axios";
// import Constants from 'expo-constants';

// const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;

const BASE_URL = "https://nominatim.openstreetmap.org/search";

const config = {
    params: {
        format: 'json',
        limit: 1,
    },
    headers: {
        'User-Agent': 'EV-Charging-App/1.0',
        'Accept-Language': 'en-US,en;q=0.9',
    }
};

// Mock data for EV charging stations
const mockChargingStations = [
    {
        id: '1',
        name: 'Tesla Supercharger',
        address: '123 Main Street',
        rating: 4.5,
        available: true,
        photo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        coordinates: {
            latitude: 0,
            longitude: 0
        }
    },
    {
        id: '2',
        name: 'EVgo Station',
        address: '456 Park Avenue',
        rating: 4.2,
        available: true,
        photo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        coordinates: {
            latitude: 0,
            longitude: 0
        }
    },
    {
        id: '3',
        name: 'ChargePoint',
        address: '789 Market Street',
        rating: 4.0,
        available: false,
        photo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        coordinates: {
            latitude: 0,
            longitude: 0
        }
    }
];

const searchLocation = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            ...config,
            params: {
                ...config.params,
                q: query
            }
        });
        return response;
    } catch (error) {
        console.error('Error searching location:', error);
        // Return mock location data if API fails
        return {
            data: [{
                lat: 19.0760,
                lon: 72.8777,
                display_name: 'Mumbai, Maharashtra, India'
            }]
        };
    }
};

const getNearbyStations = (location) => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Update mock stations with current location
            const stations = mockChargingStations.map(station => ({
                ...station,
                coordinates: {
                    latitude: location.latitude + (Math.random() * 0.01 - 0.005),
                    longitude: location.longitude + (Math.random() * 0.01 - 0.005)
                }
            }));
            resolve({ data: { results: stations } });
        }, 1000);
    });
};

export default {
    searchLocation,
    getNearbyStations
}; 