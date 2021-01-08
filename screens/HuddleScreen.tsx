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
  const [users, setUsers] = useState([{name: '', status: '', permissions: '', id: 0}]);
  const [session, setSession] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notReadyMessage, setNotReadyMessage] = useState(false);
  const [closeRoomMessage, setCloseRoomMessage] = useState(false);
  const [closeRoom, setCloseRoom] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const roomListener = firestore()
      .collection('rooms')
      .doc(`${props.route.params[0]}`)
      .onSnapshot((documentSnapshot) => {
        const firebase = documentSnapshot.data();
        if (documentSnapshot.exists) {
          setSession(firebase['active']);
        }
        if (documentSnapshot.exists) {
          setCloseRoom(firebase['closed']);
        }
        if (documentSnapshot.exists) {
          setUsers(firebase['Users']);
        }
      });
    return () => roomListener();
  }, [closeRoom]);
  useEffect(() => {
    const myUsername = props.route.params[1];
    firestore()
      .collection('rooms')
      .doc(`${props.route.params[0]}`)
      .update({
        Users: firestore.FieldValue.arrayUnion({
          name: myUsername,
          status: appStateVisible,
          permissions: props.route.params[2],
          id: props.route.params[3],
        }),
      });
  }, []);

  useEffect(() => {
    const checkPermissions = users.filter((user) => {
      return user.name == props.route.params[1];
    });
    if (closeRoom == true) {
      props.navigation.navigate('Home');
      if (checkPermissions[0]['permissions'] == 'host') {
        firestore()
          .collection('rooms')
          .doc(`${props.route.params[0]}`)
          .delete()
          .then(() => {
            console.log(`${props.route.params[0]} was deleted`);
          });
      }
    }
  }, [closeRoom]);
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
            permissions: props.route.params[2],
          }),
        });
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayUnion({
            name: props.route.params[1],
            status: nextAppState,
            permissions: props.route.params[2],
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
            permissions: props.route.params[2],
          }),
        });
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({
          Users: firestore.FieldValue.arrayUnion({
            name: props.route.params[1],
            status: nextAppState,
            permissions: props.route.params[2],
          }),
        });

      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({active: false});
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  return (
    <SafeAreaView style={{}}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          marginBottom: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#ffbe5c'}}>
          Room Code: {props.route.params[0]}
        </Text>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#ffbe5c'}}>
          Number of People: {users.length}
        </Text>
      </View>
      <ScrollView persistentScrollbar={true} style={{height: 250}}>
        {users.map((user) => {
          return (
            <View
              style={{
                alignSelf: 'flex-end',
                flexDirection: 'row',
                marginBottom: 10,
                marginRight: 50,
              }}
              key={props.route.params[3]}>
              <Text>
                {user.name} is{' '}
                {user.status == 'active'
                  ? 'in the huddle'
                  : 'not with the team'}
              </Text>
              {user.status == 'active' ? (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 2}}
                  icon={faCheck}
                  color="green"
                  size={14}
                />
              ) : (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 3}}
                  icon={faTimes}
                  color="red"
                  size={14}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={{alignItems: 'center', marginBottom: 15}}>
        <Timer session={session} room={props.route.params[0]} />
      </View>
      <View style={styles.buttonContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={notReadyMessage}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>
                Please get everyone in the Huddle before starting session!
              </Text>
              <TouchableHighlight
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
                  setNotReadyMessage(false);
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}>
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={closeRoomMessage}
          onRequestClose={() => {}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>
                You are the host, if you leave, the whole room will be closed,
                are you sure you want to leave?
              </Text>
              <TouchableHighlight
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
                  setCloseRoomMessage(false);
                  firestore()
                    .collection('rooms')
                    .doc(`${props.route.params[0]}`)
                    .update({closed: true});
                }}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableHighlight>
              <TouchableHighlight
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
                  setCloseRoomMessage(false);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            const allUserStatusCheck = users.reduce(function (a, b) {
              if (a.status && b.status == 'active') {
                return a;
              } else {
                return {status: 'inactive'};
              }
            });
            if (allUserStatusCheck.status == 'active') {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: true});
            } else {
              setNotReadyMessage(true);
            }
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
            const checkPermissions = users.filter((user) => {
              return user.name == props.route.params[1];
            });
            if (checkPermissions[0]['permissions'] == 'participant') {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({
                  Users: firestore.FieldValue.arrayRemove({
                    name: props.route.params[1],
                    status: 'active',
                    permissions: 'participant',
                    id: props.route.params[3],
                  }),
                });
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: false});
              props.navigation.navigate('Home');
            } else {
              setCloseRoomMessage(true);
            }
          }}>
          <Text style={{color: 'white', fontSize: 14}}>Exit Huddle</Text>
          <FontAwesomeIcon icon={faSignOutAlt} color="white" size={14} />
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
