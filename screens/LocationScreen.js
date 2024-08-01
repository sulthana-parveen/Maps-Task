// screens/LocationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LocationsScreen = () => {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocations = async () => {
      const savedLocations = JSON.parse(await AsyncStorage.getItem('locations')) || [];
      setLocations(savedLocations);
    };

    fetchLocations();
  }, []);

  const handlePress = (location) => {
    navigation.navigate('Map', { initialRegion: {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    } });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text>{item.title}</Text>
            <Text>{item.locationText}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});

export default LocationsScreen;