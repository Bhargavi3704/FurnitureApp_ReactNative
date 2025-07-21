
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Demosplash = ({ navigation }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
     // console.log("data=>",login)
      const login = await AsyncStorage.getItem('RELOGIN');
      const parsedLogin = login ? JSON.parse(login) : null;

      // Animate the logo
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000, // Adjust duration as needed
        useNativeDriver: true,
      }).start();

      // Navigate after 2 seconds based on login status
      setTimeout(() => {
        if (parsedLogin) {
          navigation.navigate('Main');
        } else {
          navigation.navigate('Login');
        }
      }, 2000);
    };

    checkLoginStatus(); // Check login status on mount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}>
        <Image
          source={require('../Images/Logo2.png')}
          style={styles.logo}
        />
      </Animated.View>
      <Text style={styles.poweredBy}>POWERED BY</Text>
      <Text style={styles.company}>MABERU CREATIONS PVT LTD</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#0D0D0D",
  },
  logo: {
    width: 380,
    height: 380,
    borderRadius: 250,
  },
  poweredBy: {
    alignSelf: 'center',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginTop: -80,
  },
  company: {
    alignSelf: 'center',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Demosplash;
