import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || {};
  const [newAddress, setNewAddress] = useState("");
  const [confirmAddress, setConfirmAddress] = useState("");

  const handleSave = async () => {
    if (newAddress !== confirmAddress) {
      Alert.alert("Error", "Addresses do not match!");
      return;
    }

    try {
      const newAddressObj = {
        id: route.params?.address?.id || Date.now().toString(),
        address: newAddress.trim(),
        addressTitle: type, // e.g., Home, Office, etc.
        type: type,
      };

      const stored = await AsyncStorage.getItem("savedAddresses");
      const parsed = stored ? JSON.parse(stored) : [];

      const updatedList = parsed.some(a => a.id === newAddressObj.id)
        ? parsed.map(a => (a.id === newAddressObj.id ? newAddressObj : a))
        : [...parsed, newAddressObj];

      await AsyncStorage.setItem("savedAddresses", JSON.stringify(updatedList));
      Alert.alert("Success", `${type || "New"} address saved successfully.`);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        // const home = await AsyncStorage.getItem('homeAddress');
        // const shipping = await AsyncStorage.getItem('shippingAddress');
        // if (home) setHomeAddress(home);
        // if (shipping) setShippingAddress(shipping);
        const key = type === "home" ? "homeAddress" : "shippingAddress";
        const savedAddress = await AsyncStorage.getItem(key);
        if (savedAddress) {
          setNewAddress(savedAddress);
          setConfirmAddress(savedAddress);
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    loadAddresses();
  }, []);
  
  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0D", padding: 16 }}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color={"white"} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Edit Address</Text>
        {/* <Icon name="share-variant" size={20} color={"white"} /> */}
      </View>
      {/* New Address Input */}
      <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5, color: "white", marginVertical: 60 }}>New address</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
          backgroundColor: "white"
        }}
        value={newAddress}
        onChangeText={setNewAddress}
      />

      {/* Confirm Address Input */}
      <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5, color: "white" }}>Confirm address</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "white"

        }}
        value={confirmAddress}
        onChangeText={setConfirmAddress}
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          width: '50%',
          alignSelf: 'center'
        }}
      >
        <Text style={{ color: "black", fontSize: 25, fontWeight: "bold", }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddress;
const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 40 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "white" },
})