import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfile = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

   const fetchUserData = async () => {
     const userId = await AsyncStorage.getItem("id");
     console.log("userId",userId)
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/user/user-data?_id=${userId}`
      );
      const data = await response.json();
      console.log('Fetched user data:', data);
      if (response.ok) {
        const user = data.user || data;
        setUserData({ ...data, name: data.name || data.Name || '' });
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh user data when screen is focused
  useEffect(()=>{
      fetchUserData()
    }, [])

  
  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.7,
        maxHeight: 500,
        maxWidth: 500,
        includeBase64: false,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Camera error');
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.uri) {
        await uploadImage(asset);
      } else {
        Alert.alert('Error', 'No image captured');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open camera');
    }
  };

  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        maxHeight: 500,
        maxWidth: 500,
        includeBase64: false,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Gallery error');
        return;
      }

      const asset = result.assets?.[0];
      if (asset?.uri) {
        await uploadImage(asset);
      } else {
        Alert.alert('Error', 'No image selected');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open gallery');
    }
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const uploadImage = async (photo) => {
     const userId = await AsyncStorage.getItem("id");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('_id', userId);
      formData.append('ProfilePicture', {
        uri: photo.uri,
        name: photo.fileName || 'profile.jpg',
        type: photo.type || 'image/jpeg',
      });

      const res = await fetch('http://10.0.2.2:3000/user/update-user', {
        method: 'PATCH',
         headers: {
           'Content-Type': 'multipart/form-data',
         },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
      Alert.alert('Success', 'Profile image updated');
      console.log("DATA=====>",data);
      // setUserData((prevData) => ({
      //   ...prevData,
      //   ProfilePicture: data.updatedUser?.ProfilePicture || prevData.ProfilePicture,
      // }));
      await AsyncStorage.setItem("image", data.updatedUser.ProfilePicture)
      await fetchUserData();
    } else {
      Alert.alert('Error', data.error || 'Upload failed');
    }
    } catch (error) {
      Alert.alert('Error', 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return <Text style={{ color: 'white', padding: 20 }}>Loading...</Text>;
  if (!userData)
    return <Text style={{ color: 'white', padding: 20 }}>No user data</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <Icon
          name="pencil"
          size={24}
          color="white"
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>

      <TouchableOpacity
        style={styles.profileContainer}
        onPress={handleChoosePhoto}
        activeOpacity={0.7}
      >
        <Image
          source={
            userData?.ProfilePicture
              ? {
                  uri: `http://10.0.2.2:3000/src/storage/userimages//${userData.ProfilePicture}?${new Date().getTime()}`,
                }
              : require('../Images/Profile1.png')
          }
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Icon name="camera" size={20} color="black" />
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={userData.name} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={userData.email} editable={false} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={userData.mobile} editable={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  profileContainer: { alignItems: 'center', marginBottom: 20, marginTop: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 15,
    elevation: 3,
  },
  infoContainer: { width: '100%' },
  label: { fontSize: 14, marginBottom: 5, color: 'white' },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyProfile;
