import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "@react-native-community/blur";

const WalletScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Wallet</Text>
        <Icon name="download" size={20} color="black" />
      </View>

      {/* Wallet Card */}
      <View style={styles.walletCard}>
        <Text style={styles.amount}>$0</Text>

        {/* Card Number with Blur Effect */}
        <View style={styles.cardDetails}>
          <Text style={styles.cardHolder}>Angga Risky</Text>
          <View style={styles.cardNumberContainer}>
            <BlurView style={styles.blur} blurType="light" blurAmount={10} />
            <Text style={styles.cardNumber}>2208 1996 4900</Text>
          </View>
          <Icon name="lock" size={18} color="white" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  walletCard: {
    backgroundColor: "#0A0A23",
    borderRadius: 15,
    padding: 20,
    height: 150,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  amount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHolder: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  cardNumberContainer: {
    position: "relative",
  },
  blur: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  cardNumber: {
    fontSize: 14,
    color: "white",
    letterSpacing: 2,
  },
});

export default WalletScreen;
