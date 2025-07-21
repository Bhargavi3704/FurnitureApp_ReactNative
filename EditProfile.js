import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from '@react-native-picker/picker'; // Install: npm install @react-native-picker/picker
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const EditProfileScreen = ({ navigation, route }) => {
   const userId = route.params?.userId;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
     React.useCallback(() => {
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://10.0.2.2:3000/user/user-data?_id=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.name || data.Name || '');
          setEmail(data.email || '');
          setPhone(data.mobile || '');
          setSelectedCountryCode(data.countryCode || '+1');
        } else {
          Alert.alert('Error', data.message || 'Failed to load user profile');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId])
);

  const handleUpdateProfile = async () => {
    if (!name || !email || !phone || !selectedCountryCode) {
      Alert.alert('Input Required', 'Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('_id', userId);
      formData.append('Name', name);
      formData.append('email', email);
      formData.append('mobile', phone);
      formData.append('countryCode', selectedCountryCode);

      const response = await fetch('http://10.0.2.2:3000/user/update-user', {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setName(data.updatedUser?.Name || name);
      setEmail(data.updatedUser?.email || email);
      setPhone(data.updatedUser?.mobile || phone);
      setSelectedCountryCode(data.updatedUser?.countryCode || selectedCountryCode);
        Alert.alert('Success', data.message || 'Profile updated successfully');
      } else {
        Alert.alert('Error', data.error || 'Update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email address</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneContainer}>
          <Picker
            selectedValue={selectedCountryCode}
            onValueChange={(itemValue) => setSelectedCountryCode(String(itemValue))}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="+1 (USA)" value="+1"  />
            <Picker.Item label="+91 (IND)" value="+91" />
            <Picker.Item label="+44 (UK)" value="+44" />
          </Picker>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ alignItems: 'center', alignSelf: 'center', top: 20 }}>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleUpdateProfile}>
            <Text style={styles.buyNowText}>{loading ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D0D0D', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop:40 },
    title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    inputContainer: { width: '100%',marginTop:20,gap:5},
    label: { fontSize: 14, color: 'white', marginBottom: 5 },
    input: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
    },
    pickerContainer: {
        width: 100,
        borderRightWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
    },
    buyNowButton: {
        backgroundColor: "green",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    buyNowText: {
        color: "white",
        fontSize: 14,
    },
    phoneContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 10,paddingHorizontal:5,height:50},
    picker: {color:'black', backgroundColor: 'transparent',flex:1},
});

export default EditProfileScreen;
