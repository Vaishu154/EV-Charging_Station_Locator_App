import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalApi from '../scr/GlobalApi';

// Sample EV charging locations
const SUGGESTED_LOCATIONS = [
  { id: '1', name: 'Tesla Supercharger - Downtown' },
  { id: '2', name: 'EVgo Station - Shopping Mall' },
  { id: '3', name: 'ChargePoint - City Center' },
  { id: '4', name: 'Electrify America - Highway Exit' },
  { id: '5', name: 'Public Charging Station - Park' },
];

export default function SearchBar({ onLocationSelect }) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (text) => {
    setSearchText(text);
    setError(null);

    if (text.length > 0) {
      try {
        const response = await GlobalApi.searchLocation(text);
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data);
          setShowSuggestions(true);
        } else {
          setError('No results found');
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Error fetching locations. Please try again.');
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (location) => {
    setSearchText(location.display_name);
    setShowSuggestions(false);
    if (onLocationSelect) {
      onLocationSelect({
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        name: location.display_name
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for EV charging stations"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchText('');
            setSuggestions([]);
            setShowSuggestions(false);
            setError(null);
          }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="location" size={16} color="#666" style={styles.locationIcon} />
                <Text style={styles.suggestionText}>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});