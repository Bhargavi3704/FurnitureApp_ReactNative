import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const OrderConfirmation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Order Confirmation Text */}
      <Text style={styles.title}>Your order is confirmed</Text>
      <Text style={styles.subtitle}>
        Thank you for shopping with us {'\n'}
        Your order will reach you on 18 Jan 2022.
      </Text>

      {/* Lottie Animation */}
      <LottieView
        source={require('../Images/successfully.json')} // Replace with your animation file
        autoPlay
        loop={false}
        style={styles.animation}
      />

      {/* Home Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  animation: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;
