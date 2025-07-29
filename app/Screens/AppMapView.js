import { View, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import MapViewStyle from '../Utils/MapViewStyle.json';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AppMapView({ userLocation, selectedLocation, chargingStations }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLocation) {
      console.log('User location:', userLocation);
      setIsLoading(false);
    } else {
      console.log('User location not available');
    }
  }, [userLocation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!userLocation?.latitude) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Location not available</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initialRegion}
        region={initialRegion}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="You are here"
        >
          <View style={styles.markerContainer}>
            <Image
              source={require('../../assets/EV_Charging_icon.jpg')}
              style={styles.userMarker}
              resizeMode="contain"
            />
          </View>
        </Marker>

        {/* Selected Location Marker */}
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.name || "Selected Location"}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('../../assets/EV_Charging_icon.jpg')}
                style={styles.selectedMarker}
                resizeMode="contain"
              />
            </View>
          </Marker>
        )}

        {/* Charging Station Markers */}
        {chargingStations && chargingStations.map((station, index) => (
          <Marker
            key={station.id || index}
            coordinate={{
              latitude: station.coordinates?.latitude || 0,
              longitude: station.coordinates?.longitude || 0,
            }}
            title={station.name}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('../../assets/marker.png')}
                style={styles.chargingMarker}
                resizeMode="contain"
              />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{station.name}</Text>
                <Text style={styles.calloutAddress}>{station.address}</Text>
                <View style={styles.calloutDetails}>
                  <View style={styles.calloutStatus}>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: station.available ? '#4CAF50' : '#F44336' }
                    ]} />
                    <Text style={styles.statusText}>
                      {station.available ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                  <View style={styles.vehicleCount}>
                    <Ionicons name="car-outline" size={16} color="#666" />
                    <Text style={styles.vehicleCountText}>
                      {station.availableMachines}/{station.totalMachines} machines
                    </Text>
                  </View>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarker: {
    width: 50,
    height: 50,
  },
  selectedMarker: {
    width: 40,
    height: 40,
  },
  chargingMarker: {
    width: 40,
    height: 40,
  },
  calloutContainer: {
    padding: 10,
    width: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  vehicleCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleCountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
});
