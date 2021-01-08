import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Modal,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
const JoinHuddleScreen = ({navigation}) => {
  const [invite, setInvite] = useState('');
  const [username, setUsername] = useState('');
  const [modalMessage, setModalMessage] = useState(false);
  return (
    <SafeAreaView>
      <View style={{marginTop: 150}}>
        <View style={styles.center}>
          <Text>Join Huddle</Text>
          <Text>Enter a room code below to join a huddle</Text>
        </View>
        <View style={{padding: 5}}>
          <Text>Invite Code</Text>
          <View style={styles.centerInput}>
            <TextInput
              style={{width: '100%'}}
              placeholder={'#12345'}
              value={invite}
              onChangeText={(inviteCode: string) => {
                setInvite(inviteCode);
                console.log(invite);
              }}></TextInput>
          </View>
        </View>
        <View style={{padding: 5}}>
          <Text>Your name</Text>
          <View style={styles.centerInput}>
            <TextInput
              style={{width: '100%'}}
              placeholder={'Name'}
              value={username}
              onChangeText={(name: string) => {
                setUsername(name);
                console.log(username);
              }}></TextInput>
          </View>
        </View>
        <View style={styles.center}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              firestore()
                .collection('rooms')
                .doc(`${invite}`)
                .get()
                .then((documentSnapshot) => {
                  if (documentSnapshot.exists) {
                    navigation.navigate('Huddle', [
                      invite,
                      username,
                      'participant',
                      Math.floor(Math.random() * 1000),
                    ]);
                  } else {
                    setModalMessage(true);
                  }
                });
            }}>
            <Text style={{color: 'white', fontSize: 15}}>Join Huddle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <Text style={{color: 'white', fontSize: 15}}>
              {' '}
              <FontAwesomeIcon
                style={{marginLeft: 5, marginTop: 3}}
                icon={faHome}
                color="white"
                size={14}
              />
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalMessage}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Please enter a valid invite code.</Text>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  marginRight: 30,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingRight: 30,
                  paddingLeft: 30,
                  borderRadius: 5,
                  backgroundColor: '#ffbe5c',
                }}
                onPress={() => {
                  setModalMessage(false);
                }}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  centerInput: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 5,
    paddingBottom: 5,
  },
  nameHuddle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 200,
    paddingBottom: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  joinButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: 30,
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
});
export default JoinHuddleScreen;
