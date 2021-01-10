import React, {useRef, useState, useEffect} from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';
import {faCrown} from '@fortawesome/free-solid-svg-icons';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {faCommentDots} from '@fortawesome/free-solid-svg-icons';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import Timer from '../components/Timer';

const HuddleScreen = (props: any, {navigation}: any) => {
  const [timer, setTimer] = useState('15');
  const [duration, setDuration] = useState(0);
  const [checkBoot, setCheckBoot] = useState(false);
  const [bootcount, setBootcount] = useState(0);
  const [users, setUsers] = useState([
    {name: '', status: '', permissions: '', id: 0},
  ]);
  const [session, setSession] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notReadyMessage, setNotReadyMessage] = useState(false);
  const [finish, setFinish] = useState(false);
  const [finishMessage, setFinishMessage] = useState(false);
  const [closeRoomMessage, setCloseRoomMessage] = useState(false);
  const [permissionsModal, setPermissionsModal] = useState(false);
  const [messageState, setMessageState] = useState('');
  const [huddleMessages, setHuddleMessages] = useState([
    {name: '', message: '', timestamp: 0},
  ]);
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
        if (documentSnapshot.exists) {
          setHuddleMessages(firebase['messages']);
        }
        if (documentSnapshot.exists) {
          setDuration(firebase['Duration']);
        }
        if (documentSnapshot.exists) {
          setFinish(firebase['finished']);
        }
        if (documentSnapshot.exists) {
          setCheckBoot(firebase['bootcheck']);
        }
        if (documentSnapshot.exists) {
          setBootcount(firebase['bootcounter']);
        }
      });
    return () => roomListener();
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
          permissions: props.route.params[2],
          id: props.route.params[3],
        }),
      });
  }, []);
  useEffect(() => {
    if (session === true && duration < 1) {
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({finished: true, active: false})
        .then(() => {});
    }
  }, [duration]);
  useEffect(() => {
    if (finish) {
      setFinishMessage(true);
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({finished: false});
    }
  }, [finish]);
  useEffect(() => {
    if (users.length > 0) {
      const allUserStatusCheck = users.reduce(function (a, b) {
        if (a.status && b.status == 'active') {
          return a;
        } else {
          return {status: 'inactive'};
        }
      });
      if (allUserStatusCheck.status == 'inactive') {
        firestore()
          .collection('rooms')
          .doc(`${props.route.params[0]}`)
          .update({bootcheck: true});
      } else {
        firestore()
          .collection('rooms')
          .doc(`${props.route.params[0]}`)
          .update({bootcheck: false});
      }
    }
    console.log(checkBoot);
  }, [users]);
  useEffect(() => {
    if (checkBoot == true && bootcount < 120) {
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({bootcounter: bootcount + 1});
    } else if (bootcount >= 120) {
      const stillActive = users.filter((user) => {
        return user.status == 'active';
      });
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({Users: stillActive});
      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({bootcounter: 0, bootcheck: false});
    }
  }, [checkBoot, bootcount]);
  useEffect(() => {
    const checkPermissions = users.filter((user) => {
      return user.name == props.route.params[1];
    });
    if (closeRoom == true) {
      const roomClosed = true;
      props.navigation.navigate('Home', [roomClosed]);

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
  const _handleAppStateChange = (nextAppState: string) => {
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
            id: props.route.params[3],
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
            id: props.route.params[3],
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
            id: props.route.params[3],
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
            id: props.route.params[3],
          }),
        });

      firestore()
        .collection('rooms')
        .doc(`${props.route.params[0]}`)
        .update({active: false});
    }

    appState.current = nextAppState;
    console.log(appState);
    setAppStateVisible(appState.current);
  };

  return (
    <SafeAreaView style={{}}>
      <View
        style={{
          alignItems: 'flex-start',
          backgroundColor: 'white',
          marginBottom: 10,
          paddingTop: 5,
          paddingLeft: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <FontAwesomeIcon
            style={{marginLeft: 5, marginTop: 6, marginRight: 5}}
            icon={faUsers}
            color="#ffbe5c"
            size={20}
          />
          <Text style={{fontWeight: 'bold', fontSize: 20, color: '#ffbe5c'}}>
            ∙ {props.route.params[0]} ∙ {users.length}
          </Text>
        </View>
      </View>
      <ScrollView persistentScrollbar={true} style={{height: 150}}>
        {users.map((user) => {
          return (
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                marginBottom: 5,
                marginLeft: 10,
                marginRight: 110,
              }}
              key={Math.random() * 1000}>
              {user.status == 'active' ? (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 5}}
                  icon={faCircle}
                  color="green"
                  size={10}
                />
              ) : (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 5}}
                  icon={faCircle}
                  color="red"
                  size={10}
                />
              )}
              {user.permissions == 'host' ? (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 2, marginRight: 5}}
                  icon={faCrown}
                  color="gold"
                  size={14}
                />
              ) : (
                <FontAwesomeIcon
                  style={{marginLeft: 5, marginTop: 3, marginRight: 5}}
                  icon={faUser}
                  color="#ffbe5c"
                  size={14}
                />
              )}
              <Text style={{fontWeight: 'bold'}}>{user.name}</Text>
              <Text>
                {user.status == 'active'
                  ? ' is in the huddle'
                  : ' is not with the team'}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          width: '100%',
          marginBottom: 5,
          paddingLeft: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: '#ffbe5c'}}>
            Chat
          </Text>
          <FontAwesomeIcon
            style={{marginLeft: 5, marginTop: 2}}
            icon={faCommentDots}
            color="#ffbe5c"
            size={14}
          />
        </View>

        <Timer session={session} room={props.route.params[0]} />
      </View>

      <ScrollView
        persistentScrollbar={true}
        style={{height: 150, width: '100%'}}>
        {huddleMessages.map((messageData) => {
          return (
            <View style={{paddingLeft: 10, flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold'}}>{messageData['name']}: </Text>
              <Text style={{flex: 1, flexWrap: 'wrap'}}>
                {messageData['message']}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          marginBottom: 25,
        }}>
        <TextInput
          value={messageState}
          placeholder={'Send a message'}
          style={{width: '88%', paddingLeft: 10}}
          onChangeText={(message: string) => {
            setMessageState(message);
          }}
          onSubmitEditing={() => {
            firestore()
              .collection('rooms')
              .doc(`${props.route.params[0]}`)
              .update({
                messages: firestore.FieldValue.arrayUnion({
                  name: props.route.params[1],
                  message: `${messageState}`,
                  timestamp: Date.now(),
                }),
              });
            setMessageState('');
          }}
        />
        <TouchableOpacity
          style={{
            padding: '4.5%',
            backgroundColor: '#ffbe5c',
            borderRadius: 10,
          }}
          onPress={() => {
            firestore()
              .collection('rooms')
              .doc(`${props.route.params[0]}`)
              .update({
                messages: firestore.FieldValue.arrayUnion({
                  name: props.route.params[1],
                  message: `${messageState}`,
                  timestamp: Date.now(),
                }),
              });
            setMessageState('');
          }}>
          <FontAwesomeIcon icon={faArrowRight} color="white" size={12} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={finishMessage}
          onRequestClose={() => {}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{marginBottom: 10, fontSize: 25}}>🎉🎉🎉</Text>
              <Text style={{marginBottom: 10, fontSize: 25}}>
                Your team made it to the end of the huddle! 🥳
              </Text>
              <Text style={{marginBottom: 10, fontSize: 25}}>🎉🎉🎉</Text>
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
                  setFinishMessage(false);
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={permissionsModal}
          onRequestClose={() => {}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{marginBottom: 10}}>
                Only the host has timer permissions!
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
                  setPermissionsModal(false);
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={notReadyMessage}
          onRequestClose={() => {}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>
                Please get everyone in the Huddle before starting session!
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
                  setNotReadyMessage(false);
                }}>
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
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
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.modalText2}
                  value={timer}
                  keyboardType={'numeric'}
                  onChangeText={(startTime) => {
                    setTimer(startTime);
                  }}
                />
                <Text style={{paddingTop: 15}}>minutes</Text>
              </View>

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
                    setModalVisible(!modalVisible);
                    firestore()
                      .collection('rooms')
                      .doc(`${props.route.params[0]}`)
                      .update({Duration: parseInt(timer) * 60});
                  }}>
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
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
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
                You are the host, if you leave, the room will be closed, are you
                sure you want to leave?
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
                    setCloseRoomMessage(false);
                    firestore()
                      .collection('rooms')
                      .doc(`${props.route.params[0]}`)
                      .update({closed: true});
                  }}>
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
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
                    setCloseRoomMessage(false);
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            const checkPermissions = users.filter((user) => {
              if (
                user.name == props.route.params[1] &&
                user.id == props.route.params[3]
              ) {
                return user;
              }
            });
            const allUserStatusCheck = users.reduce(function (a, b) {
              if (a.status && b.status == 'active') {
                return a;
              } else {
                return {status: 'inactive'};
              }
            });
            if (
              allUserStatusCheck.status == 'active' &&
              checkPermissions[0]['permissions'] == 'host'
            ) {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: true});
            } else if (checkPermissions[0]['permissions'] != 'host') {
              setPermissionsModal(true);
            } else if (allUserStatusCheck.status != 'active') {
              setNotReadyMessage(true);
            }
          }}>
          <Text style={{color: 'white', fontSize: 14}}>Start Session</Text>
          <FontAwesomeIcon icon={faPlay} color="white" size={14} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            const checkPermissions = users.filter((user) => {
              if (
                user.name == props.route.params[1] &&
                user.id == props.route.params[3]
              ) {
                return user;
              }
            });
            if (checkPermissions[0]['permissions'] == 'host') {
              firestore()
                .collection('rooms')
                .doc(`${props.route.params[0]}`)
                .update({active: false});
            } else {
              setPermissionsModal(true);
            }
          }}>
          <Text style={{color: 'white', fontSize: 14}}>Stop Session</Text>
          <FontAwesomeIcon icon={faStop} color="white" size={14} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            const checkPermissions = users.filter((user) => {
              if (
                user.name == props.route.params[1] &&
                user.id == props.route.params[3]
              ) {
                return user;
              }
            });
            if (checkPermissions[0]['permissions'] == 'host') {
              setModalVisible(true);
            } else {
              setPermissionsModal(true);
            }
          }}>
          <Text style={{color: 'white', fontSize: 14}}>Set Timer</Text>

          <FontAwesomeIcon icon={faClock} color="white" size={14} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            const checkPermissions = users.filter((user) => {
              if (
                user.name == props.route.params[1] &&
                user.id == props.route.params[3]
              ) {
                return user;
              }
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
  modalText2: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffbe5c',
    fontSize: 20,
    fontWeight: 'bold',
    // backgroundColor: '#F2EEEE',
  },
});
export default HuddleScreen;
