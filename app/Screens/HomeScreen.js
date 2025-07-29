import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import AppMapView from './AppMapView';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import SearchBar from './SearchBar';
import PlaceItems from './PlaceItems';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../scr/firebase';
import GlobalApi from '../scr/GlobalApi';
import { Linking } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(currentLocation);
      setSelectedLocation(currentLocation);
      GetNearByPlace(currentLocation);
    })();
  }, []);

  const GetNearByPlace = (location) => {
    setIsLoading(true);
    GlobalApi.getNearbyStations(location)
      .then((response) => {
        setChargingStations(response.data?.results || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching nearby places:", error);
        setIsLoading(false);
      });
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    GetNearByPlace(location);
  };

  const handleMarkedFav = (placeId) => {
    setFavorites(prev => {
      if (prev.includes(placeId)) {
        return prev.filter(id => id !== placeId);
      } else {
        return [...prev, placeId];
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <AppMapView
          userLocation={userLocation}
          selectedLocation={selectedLocation}
          chargingStations={chargingStations}
        />
      </View>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <Header/>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBarWrapper}>
          <SearchBar onLocationSelect={handleLocationSelect}/>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      ) : (
        <View style={styles.stationsList}>
          <FlatList
            data={chargingStations}
            renderItem={({ item }) => (
              <PlaceItems
                place={item}
                isFav={favorites.includes(item.id)}
                markedFav={() => handleMarkedFav(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      <BottomNavigation/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  searchBarWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  mapContainer: {
    flex: 1,
    marginBottom: 60,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    zIndex: 1001,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationsList: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 300,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

