import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddAddress = ({ navigation }) => {
  const [addressTitle, setAddressTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSave = async () => {
    const newAddress = {
      id: Date.now(),
      addressTitle,
      firstName,
      lastName,
      phone,
      address,
      city,
      country,
    };

    try {
      const existing = await AsyncStorage.getItem("savedAddresses");
      const saved = existing ? JSON.parse(existing) : [];

      saved.push(newAddress);
      await AsyncStorage.setItem("savedAddresses", JSON.stringify(saved));

      Alert.alert("Success", "Address added to cart.");
      navigation.goBack();
    } catch (err) {
      console.error("Failed to save address:", err);
      Alert.alert("Error", "Could not save address.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, padding: 20, backgroundColor: "#0D0D0D" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 25, marginBottom: 15 }}>
        <Icon name="arrow-left" size={24} color={"white"} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginLeft: 20 }}>
          Add Address
        </Text>
      </View>

      <TextInput style={inputStyle} placeholder="Address Title*" value={addressTitle} onChangeText={setAddressTitle} />
      <TextInput style={inputStyle} placeholder="First Name*" value={firstName} onChangeText={setFirstName} />
      <TextInput style={inputStyle} placeholder="Last Name*" value={lastName} onChangeText={setLastName} />
      <TextInput style={inputStyle} placeholder="Phone*" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={inputStyle} placeholder="Country*" value={country} onChangeText={setCountry} />
      <TextInput style={inputStyle} placeholder="City*" value={city} onChangeText={setCity} />
      <TextInput
        style={[inputStyle, { height: 80, textAlignVertical: "top" }]}
        placeholder="Address*"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "white",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          width: "60%",
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
          Save Address
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddAddress;

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  backgroundColor: "white",
};
