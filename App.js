/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'
import HomeStack from './assets/screens/Home'
import Tips from './assets/screens/Tips'
import Profile from './assets/screens/Profile'

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Tips') {
              iconName = 'list';
            } else if (route.name === 'Profile') {
              iconName = 'user'
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} type='feather' />;
          },
        })}
        tabBarOptions={{
          activeTintColor: global.accent,
          inactiveTintColor: 'gray',
          keyboardHidesTabBar: true
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Tips" component={Tips} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;