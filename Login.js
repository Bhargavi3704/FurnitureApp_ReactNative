import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const rotateY = useSharedValue(0);
    const [screen, setScreen] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [regemail, setRegemail] = useState('');
    const [regpassword, setRegpassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [newconfirmpassword, setNewconfirmpassword] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');


    const [loading, setLoading] = useState(false);
    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotateY.value}deg` }]
    }));

    const toggleScreen = (newScreen) => {
        rotateY.value = withSpring(screen === 'login' ? 180 : 0);
        setScreen(newScreen);
    };

    const handleGetStarted = async () => {
        if (!email || !password) {
            Alert.alert('Input Required', 'Please enter both email and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://10.0.2.2:3000/user/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const responseText = await response.text();
            console.log('Response Status:', response.status);
            console.log('Raw Response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonErr) {
                console.error('Failed to parse JSON:', jsonErr);
                Alert.alert('Error', 'Invalid response from server.');
                return;
            }

            // Handle successful login
            if (response.ok && (data.user || data.message?.toLowerCase().includes('success'))) {
                const userData = data.user;
                console.log('Login successful:', userData);

                // Optionally save user data locally
                await AsyncStorage.setItem('RELOGIN', JSON.stringify(true));
                await AsyncStorage.setItem('id', userData._id);

                Alert.alert('Success', data.message || 'Login successful');
                navigation.navigate('Main'); // Replace with your target screen
            } else {
                Alert.alert('Error', data.message || 'Invalid Email or Password');
            }

        } catch (error) {
            console.error('Fetch/Login error:', error);
            Alert.alert('Error', 'Unable to login. Please check your network or try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!regemail || !regpassword || !name || !mobileno || !city || !country) {
            Alert.alert('Input Required', 'Please enter all fields.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://10.0.2.2:3000/user/CreateUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: name,
                    mobile: mobileno,
                    email: regemail,
                    password: regpassword,
                    city: city,
                    country: country,
                }),
            });

            console.log('Response Status:', response.status);

            const data = await response.json();

            console.log('Parsed Response Data:', data);
            if (data.ok) {
                const user = {
                    name,
                    mobile: mobileno,
                    email: regemail,
                    city,
                    country,
                };
                await AsyncStorage.setItem('registeredUser', JSON.stringify(user));
                Alert.alert('Success', data.message || 'User Registered Successfully');
            } else if (data.message && data.message.toLowerCase().includes('used')) {
                Alert.alert('Error', 'User already exists');
            } else {
                Alert.alert('Error', data.message || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Unable to register. Please check your network or try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotpassword = async () => {
        if (!email || !newpassword) {
            Alert.alert('Input Required', 'Please enter all fields.');
            return;
        }

        setLoading(true);

        try {
            // Trim email to avoid issues with spaces
            const cleanedEmail = email.trim();

            console.log('Sending request with:', { email: cleanedEmail, newPassword: newpassword });

            const response = await fetch('http://10.0.2.2:3000/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: cleanedEmail,
                    newPassword: newpassword,
                }),
            });

            console.log('Response status:', response.status);

            const responseText = await response.text();
            console.log('Raw response text:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Parsed JSON:', data);
            } catch (err) {
                console.error('JSON parse error:', err);
                Alert.alert('Error', 'Invalid response from server');
                return;
            }

            if (response.ok) {
                Alert.alert(
                    'Success',
                    data.message || 'Password updated successfully. Go back to login.',
                    [
                        {
                            text: 'OK',
                            onPress: () => toggleScreen('login'), // Replace with navigation.navigate if you're using a navigation library
                        },
                    ]
                );
            } else {
                Alert.alert('Error', data.message || 'Failed to update password');
            }

        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Please check your network or try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={{fontSize:18,alignItems:'center',fontWeight:'bold',color:'white',bottom:25}}>Welcome</Text>
         <Text style={{fontSize:18,alignItems:'center',fontWeight:'bold',color:'white',bottom:20}}>MABERU CREATIONS</Text> */}
            <Image
                source={require('../Images/Logo2.png')}
                style={styles.logo}
            />
            <View style={[styles.card, frontAnimatedStyle]}>
                {screen === 'login' && (
                    <View style={styles.innerCard}>
                        <Text style={styles.title}>Login</Text>
                        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                        <TouchableOpacity style={styles.button} onPress={handleGetStarted}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleScreen('forgotPassword')}><Text style={styles.link}>Forgot Password?</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleScreen('register')}><Text style={styles.link}>Go to Register</Text></TouchableOpacity>
                    </View>
                )}
                {screen === 'register' && (
                    <View style={styles.innerCard}>
                        <Text style={styles.title}>Register</Text>
                        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
                        <TextInput placeholder="MobileNo" value={mobileno} onChangeText={setMobileno} style={styles.input} />
                        <TextInput placeholder="Email" value={regemail} onChangeText={setRegemail} style={styles.input} />
                        <TextInput placeholder="Password" value={regpassword} onChangeText={setRegpassword} secureTextEntry style={styles.input} />
                        <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
                        <TextInput placeholder="Country" value={country} onChangeText={setCountry} style={styles.input} />
                        <TouchableOpacity style={styles.button} onPress={handleRegister}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleScreen('login')}><Text style={styles.link}>Go to Login</Text></TouchableOpacity>
                    </View>
                )}
                {screen === 'forgotPassword' && (
                    <View style={styles.innerCard}>
                        <Text style={styles.title}>Forgot Password</Text>
                        <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} style={styles.input} />
                        <TextInput placeholder=" New Password" value={newpassword} onChangeText={setNewpassword} secureTextEntry style={styles.input} />
                        <TouchableOpacity style={styles.button} onPress={handleForgotpassword}><Text style={styles.buttonText}>Reset Password</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleScreen('login')}><Text style={styles.link}>Back to Login</Text></TouchableOpacity>
                    </View>
                )}
                {screen === 'resetPassword' && (
                    <View style={styles.innerCard}>
                        <Text style={styles.title}>Reset Password</Text>
                        <TextInput placeholder="New Password" value={newpassword} onChangeText={setNewpassword} secureTextEntry style={styles.input} />
                        <TextInput placeholder="Confirm Password" value={newconfirmpassword} onChangeText={setConfirmpassword} secureTextEntry style={styles.input} />
                        <TouchableOpacity style={styles.button} onPress={() => toggleScreen('login')}><Text style={styles.buttonText}>Update Password</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleScreen('login')}><Text style={styles.link}>Back to Login</Text></TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                <TouchableOpacity style={[styles.socialButton]}>
                    <Icon name="facebook" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton]}>
                    <Icon name="instagram" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton]}>
                    <Icon name="whatsapp" size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton]}>
                    <Icon name="twitter" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
    },
    card: {
        width: 300,
        height: 350,
        backgroundColor: '#222',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        transform: [{ perspective: 1000 }],
    },
    innerCard: {
        width: '100%',
        alignItems: 'center',
        height: '100%',
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        color: 'black',
    },
    button: {
        backgroundColor: '#ff6600',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    link: {
        color: '#ff6600',
        marginTop: 10,
        top: 10
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: "center",
        marginBottom: 10,
        width: "10%",
        marginVertical: 50
    },
    logo: {
        width: 200,
        height: 180,
        borderRadius: 250,
    },
});

export default LoginScreen;
