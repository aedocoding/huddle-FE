import React from 'react';
import {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
const Timer = (props: any) => {
  const [duration, setDuration] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const durationListener = firestore()
      .collection('rooms')
      .doc(`${props.room}`)
      .onSnapshot((documentSnapshot) => {
        const firebase = documentSnapshot.data();
        if (documentSnapshot.exists) {
          setDuration(firebase['Duration']);
        }
        if (documentSnapshot.exists) {
          setMinutes(Math.floor(firebase['Duration'] / 60));
        }
        if (documentSnapshot.exists) {
          setSeconds(firebase['Duration'] % 60);
        }
      });
    return () => durationListener();
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (props.session == true) {
        if (seconds > 0) {
          setSeconds(seconds - 1);
          firestore()
            .collection('rooms')
            .doc(`${props.room}`)
            .update({Duration: duration - 1});
        }
      }
      if (seconds === 0 && props.session == true) {
        if (minutes === 0 && props.session == true) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
          firestore()
            .collection('rooms')
            .doc(`${props.room}`)
            .update({Duration: duration - 1});
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <View
      style={{backgroundColor: 'white', width: '100%', alignItems: 'center'}}>
      {minutes === 0 && seconds === 0 ? null : (
        <Text style={{fontWeight: 'bold', fontSize: 50, color: '#ffbe5c'}}>
          {' '}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      )}
    </View>
  );
};

export default Timer;
