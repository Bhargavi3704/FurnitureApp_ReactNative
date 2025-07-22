import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, Keyboard } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Splash from "./Asserts/Screens/Splash";
import Add1 from './Asserts/Screens/Add1';
import Add2 from './Asserts/Screens/Add2';
import Login from './Asserts/Screens/Login';
import Home from './Asserts/Screens/Home';
import Notification from './Asserts/Screens/Notification';
import Categories from './Asserts/Screens/Categories';
import Search from './Asserts/Screens/Search';
import SingleProduct from './Asserts/Screens/SingleProduct';
import Products from './Asserts/Screens/Products';
import Cart from './Asserts/Screens/Cart';
import AddAddress from './Asserts/Screens/Addaddress';
import EditAddress from './Asserts/Screens/EditeAddress';
import Orders from './Asserts/Screens/Orders';
import Payment from './Asserts/Screens/Payment';
import Sucess from './Asserts/Screens/Sucess';
import Profile from './Asserts/Screens/Profile';
import Myprofile from './Asserts/Screens/Myprofile';
import EditProfile from './Asserts/Screens/EditProfile';
import Settings from './Asserts/Screens/Settings';
import Wallet from './Asserts/Screens/Wallet';
import Wishlist from './Asserts/Screens/Wishlist';
import TermsAndConditions from './Asserts/Screens/Terms&Conditions';
import PrivacyPolicy from './Asserts/Screens/Privacy&Policy';
import Coupons from './Asserts/Screens/Coupons';
import { CartContext, CartProvider } from './Asserts/Screens/CartContext';

enableScreens();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

const linking = {
  prefixes: ['Furniture://'],
  config: {
    screens: {
      ProductDetails: 'product/:id',
    },
  },
};

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator
          initialRouteName='Splash'
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0D0D0D',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name='Splash' component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name='Add1' component={Add1} options={{ headerShown: false }} />
          <Stack.Screen name='Add2' component={Add2} options={{ headerShown: false }} />
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='Notification' component={Notification} options={{ headerShown: true }} />
          <Stack.Screen name='Categories' component={Categories} options={{ headerShown: false }} />
          <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
          <Stack.Screen name='SingleProduct' component={SingleProduct} options={{ headerShown: false }} />
          <Stack.Screen name='Products' component={Products} options={{ headerShown: false }} />
          <Stack.Screen name='Cart' component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name='AddAddress' component={AddAddress} options={{ headerShown: false }} />
          <Stack.Screen name='EditAddress' component={EditAddress} options={{ headerShown: false }} />
          <Stack.Screen name='Orders' component={Orders} options={{ headerShown: false }} />
          <Stack.Screen name='Payment' component={Payment} options={{ headerShown: true }} />
          <Stack.Screen name='Sucess' component={Sucess} options={{ headerShown: true }} />
          <Stack.Screen name='Profile' component={Profile} options={{ headerShown: true }} />
          <Stack.Screen name="Main" component={TabStackNav} options={{ headerShown: false }} />
          <Stack.Screen name="Myprofile" component={Myprofile} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: true }} />
          <Stack.Screen name="Wishlist" component={Wishlist} options={{ headerShown: true }} />
          <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: true }} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ headerShown: true }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: true }} />
          <Stack.Screen name="Coupons" component={Coupons} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const TabStackNav = () => {
  // const { cartCount } = useContext(CartContext);
    const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      const stored = await AsyncStorage.getItem('Count');
      console.log("stored=====>",stored);
      if (stored !== null) setCartCount(JSON.parse(stored));
    };
    loadCartCount();
  }, []);
  console.log("cartLenthPassed Data=============>",cartCount);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: isKeyboardVisible
          ? { display: 'none' }
          : {
              height: 60,
              backgroundColor: '#333',
              borderTopWidth: 0,
              borderRadius: 25,
              position: 'absolute',
              left: 10,
              right: 10,
              bottom: 15,
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 15,
            },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#aaa',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={30} color={focused ? '#fff' : '#aaa'} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon name="shape-plus" size={30} color={focused ? '#fff' : '#aaa'} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 40, height: 35, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="cart" size={30} color={focused ? '#fff' : '#aaa'} />
              {cartCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon name="account-circle" size={30} color={focused ? '#fff' : '#aaa'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
