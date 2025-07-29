import {
  View,
  Text,
  Image,
  ToastAndroid,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../Utils/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  deleteDoc,
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { app, auth } from "../scr/firebase";
import * as Location from "expo-location";

export default function PlaceItems({ place, isFav, markedFav }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isFavorite, setIsFavorite] = useState(isFav);

  const db = getFirestore(app);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (place?.coordinates) {
      const { latitude, longitude } = place.coordinates;
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
      setPhotoUrl(mapUrl);
    }
  }, [place]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show(
          "Permission to access location was denied",
          ToastAndroid.TOP
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      ToastAndroid.show("Error getting current location", ToastAndroid.TOP);
    }
  };

  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      ToastAndroid.show("Please login to add favorites", ToastAndroid.TOP);
      return;
    }

    try {
      if (isFavorite) {
        const q = query(
          collection(db, "ev-fav-place"),
          where("email", "==", user.email),
          where("place.id", "==", place.id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
        });
        ToastAndroid.show("Removed from favorites", ToastAndroid.TOP);
      } else {
        await addDoc(collection(db, "ev-fav-place"), {
          email: user.email,
          place: place,
        });
        ToastAndroid.show("Added to favorites", ToastAndroid.TOP);
      }

      setIsFavorite(!isFavorite);

      // Notify parent component to update list
      if (markedFav) {
        markedFav();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      ToastAndroid.show("Error updating favorites", ToastAndroid.TOP);
    }
  };

  const onDirectionClick = async () => {
    if (!place?.coordinates) {
      ToastAndroid.show("Destination location not available", ToastAndroid.TOP);
      return;
    }

    if (!currentLocation) {
      await getCurrentLocation();
      if (!currentLocation) {
        ToastAndroid.show("Current location not available", ToastAndroid.TOP);
        return;
      }
    }

    const { latitude: destLat, longitude: destLng } = place.coordinates;
    const { latitude: currentLat, longitude: currentLng } = currentLocation;

    // Create URLs for different platforms and apps
    const urls = {
      googleMaps: {
        ios: `comgooglemaps://?saddr=${currentLat},${currentLng}&daddr=${destLat},${destLng}&directionsmode=driving`,
        android: `google.navigation:q=${destLat},${destLng}&origin=${currentLat},${currentLng}&travelmode=d`,
      },
      appleMaps: {
        ios: `maps://?saddr=${currentLat},${currentLng}&daddr=${destLat},${destLng}&dirflg=d`,
      },
      waze: {
        ios: `waze://?ll=${destLat},${destLng}&navigate=yes`,
        android: `waze://?ll=${destLat},${destLng}&navigate=yes`,
      },
      web: `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${destLat},${destLng}&travelmode=driving`
    };

    try {
      // Try Google Maps first
      const googleMapsUrl = Platform.select({
        ios: urls.googleMaps.ios,
        android: urls.googleMaps.android,
      });

      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);
      
      if (canOpenGoogleMaps) {
        await Linking.openURL(googleMapsUrl);
        return;
      }

      // Try Apple Maps on iOS
      if (Platform.OS === 'ios') {
        const canOpenAppleMaps = await Linking.canOpenURL(urls.appleMaps.ios);
        if (canOpenAppleMaps) {
          await Linking.openURL(urls.appleMaps.ios);
          return;
        }
      }

      // Try Waze
      const wazeUrl = Platform.select({
        ios: urls.waze.ios,
        android: urls.waze.android,
      });

      const canOpenWaze = await Linking.canOpenURL(wazeUrl);
      if (canOpenWaze) {
        await Linking.openURL(wazeUrl);
        return;
      }

      // Fallback to web version
      await Linking.openURL(urls.web);
    } catch (err) {
      console.error("Error opening directions:", err);
      // Final fallback to web URL
      try {
        await Linking.openURL(urls.web);
      } catch (webErr) {
        ToastAndroid.show("Could not open directions", ToastAndroid.TOP);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={
              photoUrl
                ? { uri: photoUrl }
                : require("../../assets/ev-car-charging.png")
            }
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.favoriteButtonBackground,
                {
                  backgroundColor: isFavorite
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(0,0,0,0.5)",
                },
              ]}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? Colors.RED : "white"}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={Colors.YELLOW} />
            <Text style={styles.rating}>{place.rating || "0.0"}</Text>
          </View>
          <View style={styles.machinesContainer}>
            <Text style={styles.machines}>
              {place.availableMachines}/{place.totalMachines} Machines Available
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: place.available
                    ? Colors.GREEN
                    : Colors.RED,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {place.available ? "Available" : "Unavailable"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.directionButton}
            onPress={onDirectionClick}
          >
            <FontAwesome5 name="location-arrow" size={16} color="white" />
            <Text style={styles.directionText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1,
  },
  favoriteButtonBackground: {
    padding: 8,
    borderRadius: 20,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
  },
  machinesContainer: {
    marginBottom: 5,
  },
  machines: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  directionButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  directionText: {
    color: "white",
    marginLeft: 5,
    fontFamily: "outfit-medium",
  },
});
