import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (screenName) => {
    return route.name === screenName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.iconContainer, isActive('Home') && styles.activeIcon]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons 
          name={isActive('Home') ? "home" : "home-outline"} 
          size={24} 
          color={isActive('Home') ? "#4285F4" : "#666"} 
        />
        <Text style={[styles.iconText, isActive('Home') && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isActive('Favorites') && styles.activeIcon]}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Ionicons 
          name={isActive('Favorites') ? "heart" : "heart-outline"} 
          size={24} 
          color={isActive('Favorites') ? "#4285F4" : "#666"} 
        />
        <Text style={[styles.iconText, isActive('Favorites') && styles.activeText]}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isActive('Profile') && styles.activeIcon]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons 
          name={isActive('Profile') ? "person" : "person-outline"} 
          size={24} 
          color={isActive('Profile') ? "#4285F4" : "#666"} 
        />
        <Text style={[styles.iconText, isActive('Profile') && styles.activeText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  iconContainer: {
    alignItems: 'center',
    padding: 5,
  },
  activeIcon: {
    borderBottomWidth: 2,
    borderBottomColor: '#4285F4',
  },
  iconText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
}); 