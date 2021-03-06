/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {connect} from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import CreateHuddleScreen from './screens/CreateHuddleScreen';
import JoinHuddleScreen from './screens/JoinHuddleScreen';
import HuddleScreen from './screens/HuddleScreen';

const Stack = createStackNavigator();
const App: () => React.ReactNode = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Create Huddle"
            component={CreateHuddleScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Join Huddle"
            component={JoinHuddleScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Huddle"
            component={HuddleScreen}
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 10,
  },
  createButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 70,
    borderRadius: 5,
    borderWidth: 1.5,
    marginTop: 20,
    borderColor: '#ffbe5c',
  },
  joinButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 70,
    borderRadius: 5,
    borderWidth: 0.5,
    marginTop: 20,
    backgroundColor: '#ffbe5c',
    borderColor: '#ffbe5c',
  },
  homeScreen: {
    backgroundColor: Colors.gray,
    paddingTop: 150,
  },

  body: {
    backgroundColor: Colors.white,
  },

  highlight: {
    fontWeight: '700',
  },
});
const mapStateToProps = () => {
  return {};
};
// export default connect(mapStateToProps, {})(App);
export default App;
