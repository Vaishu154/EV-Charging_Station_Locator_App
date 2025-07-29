import React, { useContext } from "react";
import { Marker, Image } from "react-native-maps";
import { SelectedMarkerContext } from "../../Context/SelectedMarkerContext";

export default function Markers({ index, place, isUserLocation = false }) {
  // Ensure that place and coordinates exist before rendering the Marker
  if (!place || !place.coordinates) return null;

  const { latitude, longitude } = place.coordinates;

  // Check if latitude and longitude are valid numbers before rendering the Marker
  if (isNaN(latitude) || isNaN(longitude)) return null;

  const { selectedMarker, setSelectedMarker } = useContext(SelectedMarkerContext);

  return (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      onPress={() => setSelectedMarker(index)}
    >
      <Image
        source={require('../../assets/EV_Charging_icon.jpg')}
        style={{ 
          width: isUserLocation ? 50 : 40,
          height: isUserLocation ? 50 : 40,
          resizeMode: 'contain'
        }}
      />
    </Marker>
  );
}