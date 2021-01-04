import React, {useRef, useState, useEffect} from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Modal,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import Timer from '../components/Timer';

const HuddleScreen = (props: any, {navigation}: any) => {
  const [timer, setTimer] = useState('15');
  const [users, setUsers] = useState([{name: '', status: ''}]);
  const [session, setSession] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  useEffect(() => {
    const subscriber = firestore()
      .collection('rooms')
      .doc(`${props.route.params[0]}`)
      .onSnapshot((documentSnapshot) => {
        const firebase = documentSnapshot.data();
        const currentUsers = firebase['Users'];
        setUsers(currentUsers);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  useEffect(() => {
    const subscriber = firestore()
      .collection('rooms')
      .doc(`${props.route.params[0]}`)
      .onSnapshot((documentSnapshot) => {
        const firebase = documentSnapshot.data();
        const active = firebase['active'];
        setSession(active);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);
  useEffect(() => {
    const myUsername = props.route.params[1];
    firestore()
      .collection('rooms')
      .doc(`${props.route.params[0]}`)
      .update({
        Users: firestore.FieldValue.arrayUnion({
          name: myUsername,
          status: appStateVisible,
        }),
      });
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayRemove({
            name: props.route.params[1],
            status: 'background',
          }),
        });
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayUnion({
            name: props.route.params[1],
            status: nextAppState,
          }),
        });
    } else {
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayRemove({
            name: props.route.params[1],
            status: 'active',
          }),
        });
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayUnion({
            name: props.route.params[1],
            status: nextAppState,
          }),
        });
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{marginTop: 50}}>
        {users.map((user) => {
          return (
            <View
              style={{alignSelf: 'center', flexDirection:'row', marginBottom: 10}}
              key={user.name}>
              <Text>
                {user.name} is{' '}
                {user.status == 'active'
                  ? 'in the huddle'
                  : 'not with the team'}
              </Text>
              {user.status == 'active' ? (
                <FontAwesomeIcon style={{marginLeft: 5, marginTop: 2}} icon={faCheck} color="green" size={14} />
              ) : (
                <FontAwesomeIcon style={{marginLeft: 5,  marginTop: 3}} icon={faTimes} color="red" size={14} />
              )}
            </View>
          );
        })}

        <View style={{alignItems: 'center', marginBottom: 15}}>
          <Timer session={session} room={props.route.params[0]} />
        </View>
        <View></View>
        <View style={styles.buttonContainer}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.modalText}
                  value={timer}
                  onChangeText={(startTime) => {
                    setTimer(startTime);
                  }}></TextInput>

                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#ffbe5c'}}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    firestore()
                      .collection('rooms')
                      .doc(`${props.route.params[0]}`)
                      .update({Duration: parseInt(timer) * 60});
                  }}>
                  <Text style={styles.textStyle}>Set Timer</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: true});
            }}>
            <Text style={{color: 'white', fontSize: 14}}>Start Session</Text>
            <FontAwesomeIcon icon={faPlay} color="white" size={14} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: false});
            }}>
            <Text style={{color: 'white', fontSize: 14}}>Stop Session</Text>
            <FontAwesomeIcon icon={faStop} color="white" size={14} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={{color: 'white', fontSize: 14}}>Set Timer</Text>
            <FontAwesomeIcon icon={faClock} color="white" size={14} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({
                  Users: firestore.FieldValue.arrayRemove({
                    name: props.route.params[1],
                    status: 'active',
                  }),
                });
              props.navigation.navigate('Home');
            }}>
            <Text style={{color: 'white', fontSize: 14}}>Exit Huddle</Text>
            <FontAwesomeIcon icon={faSignOutAlt} color="white" size={14} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 50,
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default HuddleScreen;
