import React, {useState} from 'react';
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
import firestore from '@react-native-firebase/firestore';
const CreateHuddleScreen = ({navigation}) => {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  return (
    <SafeAreaView>
      <View style={{marginTop: 150, marginBottom: 10, marginLeft: 5}}>
        <Text>Your Huddle</Text>
      </View>
      <View style={styles.nameHuddle}>
        <TextInput
          placeholder={'Name your Huddle'}
          value={room}
          onChangeText={(roomCode: string) => {
            setRoom(roomCode);
            console.log(room);
          }}></TextInput>
      </View>
      <View style={{padding: 5}}>
        <Text>Your name</Text>
        <View style={styles.centerInput}>
          <TextInput
            placeholder={'Enter your name here'}
            value={username}
            onChangeText={(name: string) => {
              setUsername(name);
              console.log(username);
            }}></TextInput>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            const milliseconds = Date.now()
            const date = new Date(milliseconds)
            firestore()
              .collection('rooms')
              .doc(`${room}`)
              .set({
                Id: room,
                Users: [],
                Timestamp: date.toString(),
                Duration: 900,
                active: false
              })
              .then(() => {
                navigation.navigate('Huddle', [room, username]);
              });
          }}>
          <Text style={{color: 'white', fontSize: 15}}>Create Huddle</Text>
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
    marginBottom: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    width: '100%',
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
});
export default CreateHuddleScreen;
