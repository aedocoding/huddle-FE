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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome} from '@fortawesome/free-solid-svg-icons';
const JoinHuddleScreen = ({navigation}) => {
  const [invite, setInvite] = useState('');
  const [username, setUsername] = useState('');
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
              navigation.navigate('Huddle', [invite, username, 'participant', Math.floor(Math.random() * 100)]);
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
});
export default JoinHuddleScreen;
