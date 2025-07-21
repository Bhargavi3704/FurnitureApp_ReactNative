import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  // const userId = '683d74302a6b6099317f548a' || '683feee9f54841e680682b2c'
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await AsyncStorage.getItem("id");
      console.log("userId",userId)
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      try {
        const response = await fetch(`http://10.0.2.2:3000/user/user-data?_id=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUserData({
            name: data.name || data.Name || 'Unknown',
            email: data.email || 'noemail@example.com',
            profileImage: data.ProfilePicture || '',
          });
        } else {
          Alert.alert('Error', data.message || 'Failed to load user data');
        }
      } catch (err) {
        Alert.alert('Error', 'Network request failed');
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => navigation.replace('Login') }
      ]
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.profileSection}>
        <Image
          source={
            userData?.profileImage
              ? { uri: `http://10.0.2.2:3000/src/storage/userimages/${userData.profileImage}` }
              : require('../Images/Profile1.png')
          }
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData?.name || 'Loading...'}</Text>
        <Text style={styles.email}>{userData?.email || 'Loading...'}</Text>
      </View>
      <View style={styles.menuContainer}>
        <MenuItem icon="account-circle" label="Profile" onPress={() => navigation.navigate('Myprofile')} />
        <MenuItem icon="bell-circle" label="Notification" onPress={() => navigation.navigate('Notification')} />
        {/* <MenuItem icon="wallet-outline" label="My wallet" onPress={() => navigation.navigate('Wallet')} /> */}
        <MenuItem icon="heart" label="my Wishlist" onPress={() => navigation.navigate('Wishlist')} />
        <MenuItem icon="cog" label="Settings" onPress={() => navigation.navigate('Settings')} />
        <MenuItem icon="shield" label="Security" onPress={() => navigation.navigate('SecurityScreen')} />
        <MenuItem icon="information" label="About" onPress={() => navigation.navigate('AboutScreen')} />
        <MenuItem icon="logout" label="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

// MenuItem Component with onPress
const MenuItem = ({ icon, label, onPress }) => (
  <ScrollView>
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={20} color="#333" />
      <Text style={styles.menuText}>{label}</Text>
      <Icon name="chevron-right" size={30} color="black" />
    </TouchableOpacity>
  </ScrollView>

);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingVertical: 20,
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 14,
    color: 'white',
  },
  menuContainer: {
    width: '90%',
    bottom: 50
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ProfileScreen;
