import React from 'react';
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
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
const CreateHuddleScreen = ({navigation}) => {
    return(
        <SafeAreaView>
            <View style={styles.nameHuddle}>
            <TextInput placeholder={'Name your Huddle'}></TextInput>
            </View>
            <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.joinButton} onPress={() => {navigation.navigate('Huddle')}}>
            <Text style={{color: 'white', fontSize: 20}}>Create Huddle</Text>
            <FontAwesomeIcon icon={faCoffee} color="white" size={32} />
          </TouchableOpacity>
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
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
      width: "100%"
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
    }
  });
export default CreateHuddleScreen