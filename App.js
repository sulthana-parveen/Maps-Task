// App.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from './screens/MapsScreen';
import LocationsScreen from './screens/LocationScreen';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Locations" component={LocationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}