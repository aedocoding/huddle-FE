/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {faUsers} from '@fortawesome/free-solid-svg-icons';

const App: () => React.ReactNode = () => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.createButton} onPress={() => {}}>
              <Text style={{color: '#ffbe5c', fontSize: 20}}>
                Create Huddle
              </Text>
              <FontAwesomeIcon icon={faCoffee} color="orange" size={32} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.joinButton} onPress={() => {}}>
              <Text style={{color: 'white', fontSize: 20}}>Join Huddle</Text>
              <FontAwesomeIcon icon={faUsers} color="white" size={32} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  scrollView: {
    backgroundColor: Colors.gray,
    paddingTop: 150,
  },

  body: {
    backgroundColor: Colors.white,
  },

  highlight: {
    fontWeight: '700',
  },
});
const mapStateToProps = () => {
  return {};
};
// export default connect(mapStateToProps, {})(App);
export default App;
