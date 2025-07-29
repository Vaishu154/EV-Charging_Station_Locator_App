import { View, Text, FlatList, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PlaceItems from "./PlaceItems";
import { getFirestore } from "firebase/firestore";
import { app } from "../scr/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../scr/firebase";

export default function PlaceListView({ placeList }) {
  const [favList, setFavList] = useState([]);
  const flatListRef = useRef(null);

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get("window").width * 0.8,
    offset: Dimensions.get("window").width * 0.8 * index,
    index,
  });

  const db = getFirestore(app);

  useEffect(() => {
    if (auth.currentUser) {
      getFav();
    }
  }, [auth.currentUser]);

  const getFav = async () => {
    try {
      setFavList([]);
      const q = query(
        collection(db, "ev-fav-place"),
        where("email", "==", auth.currentUser?.email)
      );

      const querySnapshot = await getDocs(q);
      const newFavList = [];
      querySnapshot.forEach((doc) => {
        newFavList.push(doc.data());
      });
      setFavList(newFavList);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const isFav = (place) => {
    return favList.some((item) => item.place.id === place.id);
  };

  return (
    <View style={{ height: 300 }}>
      <FlatList
        data={placeList}
        horizontal={true}
        pagingEnabled
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item, index }) => (
          <View key={index} style={{ marginRight: 10 }}>
            <PlaceItems
              place={item}
              isFav={isFav(item)}
              markedFav={getFav}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
} 