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
  TouchableHighlight,
  TextInput,
  Modal,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faStop} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
const HuddleScreen = ({navigation}) => {
  const fakeNames = ['Your Name', 'Someone elses name', 'Another persons name'];
  const timer = '10:00';
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView>
      {fakeNames.map((name) => {
        return (
          <View style={{alignItems: 'center', marginBottom: 10}} key={name}>
            <Text>{name}</Text>
          </View>
        );
      })}
      <View style={{alignItems: 'center', marginBottom: 125}}>
        <Text style={{color: '#ffbe5c', fontSize: 30}}>{timer}</Text>
      </View>
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
              <TextInput style={styles.modalText} placeholder={'10:00'}></TextInput>

              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Set Timer</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.playButton} onPress={() => {}}>
          <Text style={{color: 'white', fontSize: 14}}>Start Session</Text>
          <FontAwesomeIcon icon={faPlay} color="white" size={14} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={() => {}}>
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
            navigation.navigate('Home');
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
    justifyContent: "center",
    alignItems: "center",

  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default HuddleScreen;
