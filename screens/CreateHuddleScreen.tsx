import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
const CreateHuddleScreen = ({navigation}) => {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [modalMessage, setModalMessage] = useState(false);
  return (
    <SafeAreaView>
      <View style={{marginTop: 150, marginBottom: 10, marginLeft: 5}}></View>
      <View style={{padding: 5}}>
        <Text>Your Huddle</Text>

        <View style={styles.centerInput}>
          <TextInput
            style={{width: '100%'}}
            placeholder={'Name your Huddle'}
            value={room}
            onChangeText={(roomCode: string) => {
              setRoom(roomCode);
              console.log(room);
            }}></TextInput>
        </View>
      </View>
      <View style={{padding: 5}}>
        <Text>Your Name</Text>
        <View style={styles.centerInput}>
          <TextInput
            style={{width: '100%'}}
            placeholder={'Enter your name here'}
            value={username}
            onChangeText={(name: string) => {
              setUsername(name);
              console.log(username);
            }}></TextInput>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalMessage}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>
            Please choose a different name for your huddle, that one is already taken!
            </Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            const milliseconds = Date.now();
            const date = new Date(milliseconds);
            firestore()
              .collection('rooms')
              .doc(`${room}`)
              .get()
              .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                  setModalMessage(true);
                } else {
                  firestore()
                    .collection('rooms')
                    .doc(`${room}`)
                    .set({
                      Id: room,
                      Users: [],
                      Timestamp: date.toString(),
                      Duration: 900,
                      active: false,
                      messages: [],
                      closed: false,
                    })
                    .then(() => {
                      navigation.navigate('Huddle', [
                        room,
                        username,
                        'host',
                        Math.floor(Math.random() * 100),
                      ]);
                    });
                }
              });
          }}>
          <Text style={{color: 'white', fontSize: 15}}>Create Huddle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 5,
    paddingBottom: 5,
  },
  centerInput: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 5,
  },
  nameHuddle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
    width: '100%',
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
  createButton: {
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default CreateHuddleScreen;
