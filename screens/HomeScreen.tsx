import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
const logo = require("../logo.png")

const HomeScreen = ({navigation}) => {
  return (
    <SafeAreaView>
          <View  style={{alignItems:'center', marginTop: 40}}>
      <Image
        style={{height: 141, width: 150}}
        source={logo}
      />
      </View>
      <View style={{alignItems:'center', marginTop: 40}}>
        <Text style={{color:'#ffbe5c', fontWeight: 'bold', fontSize: 25}}>H U D D L E</Text>
      </View>
      <View style={styles.homeScreen}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={() => {navigation.navigate('Create Huddle')}}>
            <Text style={{color: '#ffbe5c', fontSize: 20}}>Create Huddle</Text>
            <FontAwesomeIcon icon={faCoffee} color="orange" size={32} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.joinButton} onPress={() => {navigation.navigate('Join Huddle')}}>
            <Text style={{color: 'white', fontSize: 20}}>Join Huddle</Text>
            <FontAwesomeIcon icon={faUsers} color="white" size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
      paddingTop: 50,
    },
  
    body: {
      backgroundColor: Colors.white,
    },
  
    highlight: {
      fontWeight: '700',
    },
  });
export default HomeScreen;
