import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Alert } from "react-native";
import Colors from "../Utils/Colors";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../scr/firebase";
import PlaceItems from "./PlaceItems"; // Assuming this is a custom component to render each place

export default function FavouriteScreen() {
  const db = getFirestore();
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getFav(); // Fetch favorites when the component is mounted
    }
  }, []);

  const getFav = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Query the ev-fav-place collection for the user's favorites
      const q = query(
        collection(db, "ev-fav-place"),
        where("email", "==", user.email)
      );
      
      const querySnapshot = await getDocs(q);
      const favorites = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.place) {
          favorites.push(data.place);
        }
      });

      console.log("Favorites fetched:", favorites);
      setFavList(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (place) => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("You must be logged in to add favorites");
      return;
    }

    // Check if the place is already in the user's favorites
    if (favList.some((favPlace) => favPlace.place === place.place)) {
      Alert.alert("This place is already in your favorites.");
      return;
    }

    // Add the new place to favorites
    const updatedFavList = [...favList, place];

    try {
      const favPlacesRef = doc(db, "users", user.uid);
      await updateDoc(favPlacesRef, {
        favorites: updatedFavList, // Update only the favorites array
      });

      setFavList(updatedFavList); // Update the local state immediately without refetching
      Alert.alert("Added to Favorites!");
    } catch (error) {
      console.error("Error saving favorite:", error);
      Alert.alert("Error saving favorite.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text
        style={{
          textAlign: "center",
          fontFamily: "outfit-medium",
          marginTop: 5,
          fontSize: 30,
          padding: 5,
        }}
      >
        My Favourite <Text style={{ color: Colors.PRIMARY }}>List</Text>
      </Text>

      {loading ? (
        <View
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: "outfit", margin: 5 }}>Loading...</Text>
        </View>
      ) : favList.length === 0 ? (
        <View
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "outfit", margin: 5 }}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favList}
          onRefresh={() => getFav()} // Refresh the list when user pulls down
          refreshing={loading}
          renderItem={({ item, index }) => (
            <PlaceItems
              place={item} // Passing the full place object
              isFav={true}
              markedFav={() => addFavorite(item)} // Call addFavorite when marked
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}
