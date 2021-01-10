import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
const logo = require('../logo.png');

const HomeScreen = (props: any, {navigation}: any) => {
  const [closedModal, setClosedModal] = useState(false);
  useEffect(() => {
    console.log(props.route.params)
    if (props.route.params[0] == true){
      setClosedModal(true)
      props.route.params[0] = false
      console.log(props.route.params[0])
    }
  },[props.route.params[0]])
  return (
    <SafeAreaView>
      <View style={{alignItems: 'center', marginTop: 40}}>
        <Image style={{height: 141, width: 150}} source={logo} />
      </View>
      <View style={{alignItems: 'center', marginTop: 40}}>
        <Text style={{color: '#ffbe5c', fontWeight: 'bold', fontSize: 25}}>
          H U D D L E
        </Text>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={closedModal}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{marginBottom: 10}}>
              Host has closed the room.
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 5,
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 30,
                paddingLeft: 30,
                borderRadius: 5,
                backgroundColor: '#ffbe5c',
              }}
              onPress={() => {
                setClosedModal(false);
              }}>
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.homeScreen}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              props.navigation.navigate('Create Huddle');
            }}>
            <Text style={{color: '#ffbe5c', fontSize: 20}}>Create Huddle</Text>
            <FontAwesomeIcon icon={faCoffee} color="orange" size={32} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              props.navigation.navigate('Join Huddle');
            }}>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
 
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeScreen: {
    paddingTop: 50,
  },

  body: {},

  highlight: {
    fontWeight: '700',
  },
});
export default HomeScreen;
