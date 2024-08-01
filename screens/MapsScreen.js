// screens/MapScreen.js
import React, { useState } from 'react';
import { View, Alert, Button, Modal, Text, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [title, setTitle] = useState('');

  const handlePress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
      const locationText = response.data.display_name;

      setSelectedLocation({ latitude, longitude, locationText });
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location details.');
    }
  };

  const saveLocation = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required.');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'No location selected.');
      return;
    }

    const newLocation = {
      title,
      locationText: selectedLocation.locationText,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      time: new Date().toISOString()
    };

    try {
      const savedLocations = JSON.parse(await AsyncStorage.getItem('locations')) || [];
      savedLocations.push(newLocation);
      await AsyncStorage.setItem('locations', JSON.stringify(savedLocations));
      setModalVisible(false);
      setTitle(''); // Clear title after saving
      setSelectedLocation(null); // Clear selected location
    } catch (error) {
      Alert.alert('Error', 'Failed to save location.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onPress={handlePress}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude
            }}
            title={selectedLocation.locationText}
          />
        )}
      </MapView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Save Location</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <Text>Location: {selectedLocation?.locationText}</Text>
          <Text>Latitude: {selectedLocation?.latitude}</Text>
          <Text>Longitude: {selectedLocation?.longitude}</Text>
          <Text>Time: {new Date().toISOString()}</Text>
          <Button title="Save" onPress={saveLocation} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 10
  }
});

export default MapScreen;
